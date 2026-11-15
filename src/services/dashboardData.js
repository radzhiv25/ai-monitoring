import { alertCatalog, departmentCatalog, integrationCatalog, licenseCatalog, modelUsage, periodOptions, toolCatalog } from '../data/demoData.js';

const formatMoneyForData=(value)=>`$${Number(value||0).toLocaleString('en-US')}`;
const allocation = (total, weights) => {
  const denominator = weights.reduce((sum, value) => sum + value, 0) || 1;
  let distributed = 0;
  return weights.map((weight, index) => {
    const value = index === weights.length - 1 ? total - distributed : Math.round(total * weight / denominator);
    distributed += value;
    return value;
  });
};
const currentSpend = (row, month) => Math.round(row.monthlyCost * month.usageFactor);
const currentUsage = (row, month) => ({
  requests: Math.round(row.requests * month.apiUsageFactor),
  inputTokens: Math.round(row.inputTokens * month.apiUsageFactor),
  outputTokens: Math.round(row.outputTokens * month.apiUsageFactor),
});

export function getModelMetrics(month, { provider = 'All providers', department = 'All departments' } = {}) {
  const rows = modelUsage.filter((row) => (provider === 'All providers' || row.provider === provider)
    && (department === 'All departments' || row.department === department)).map((row) => {
    const usage = currentUsage(row, month);
    const spend = currentSpend(row, month);
    return { ...row, ...usage, spend, totalTokens:usage.inputTokens+usage.outputTokens, averageCostPerRequest:spend/Math.max(1,usage.requests) };
  });
  const totalSpend=rows.reduce((sum,row)=>sum+row.spend,0);
  const totalTokens=rows.reduce((sum,row)=>sum+row.totalTokens,0);
  const totalRequests=rows.reduce((sum,row)=>sum+row.requests,0);
  return rows.map((row)=>({...row,spendShare:totalSpend?row.spend/totalSpend:0,tokenShare:totalTokens?row.totalTokens/totalTokens:0,requestShare:totalRequests?row.requests/totalRequests:0}));
}

export function getToolsForMonth(month, { department = 'All departments', provider = 'All providers', governanceOverrides = {} } = {}) {
  return toolCatalog.map((tool) => {
    const modelRows=tool.kind==='API consumption'?getModelMetrics(month,{provider:tool.provider,department:tool.ownerDepartment}):[];
    const toolModels=tool.kind==='API consumption'?modelUsage.filter((row)=>row.provider===tool.provider&&row.department===tool.ownerDepartment):[];
    const telemetry=tool.kind==='API consumption'&&toolModels.length?toolModels.map((row)=>currentUsage(row,month)).reduce((total,row)=>({requests:total.requests+row.requests,inputTokens:total.inputTokens+row.inputTokens,outputTokens:total.outputTokens+row.outputTokens}),{requests:0,inputTokens:0,outputTokens:0}):null;
    const modelSpend=modelRows.reduce((sum,row)=>sum+row.spend,0);
    return {
      ...tool,
      spend:tool.kind==='API consumption'&&modelRows.length?modelSpend:Math.round(tool.monthlySpend*month.usageFactor),
      activeUsers:tool.usageDataAvailable===false?null:tool.users===0?0:Math.max(1,Math.round(tool.users*month.activeUsers/periodOptions.at(-1).activeUsers)),
      governance:governanceOverrides[tool.id]||tool.governance,
      requests:telemetry?.requests??null,inputTokens:telemetry?.inputTokens??null,outputTokens:telemetry?.outputTokens??null,
      usageDataAvailable:tool.usageDataAvailable!==false,
    };
  }).filter((tool)=>(department==='All departments'||tool.ownerDepartment===department)&&(provider==='All providers'||tool.provider===provider));
}

export function getSpendSeries({ throughMonth, granularity = 'month', range = 'Last 6 months', department = 'All departments', provider = 'All providers', departmentBudgetOverrides = {} }) {
  const end=periodOptions.findIndex((item)=>item.month===throughMonth.month);
  const start=range==='Selected month'?end:range==='Last 3 months'?Math.max(0,end-2):0;
  const rows=periodOptions.slice(start,end+1).map((month)=>{
    const tools=getToolsForMonth(month,{department,provider});
    const spend=tools.reduce((sum,tool)=>sum+tool.spend,0);
    const budget=department==='All departments'?(provider==='All providers'?45000:tools.reduce((sum,tool)=>sum+tool.monthlyLimit,0)):(departmentBudgetOverrides[department]??departmentCatalog.find((item)=>item.name===department)?.monthlyBudget??0);
    return {month:month.month,spend,budget,requests:tools.reduce((sum,tool)=>sum+(tool.requests||0),0)};
  });
  if(granularity==='month')return rows;
  const selected=rows.at(-1)?[rows.at(-1)]:[];
  const shares=[0.19,0.22,0.25,0.34];
  return selected.flatMap((row)=>{
    const weeklySpend=allocation(row.spend,shares);const weeklyBudget=allocation(row.budget,[1,1,1,1]);const weeklyRequests=allocation(row.requests,shares);
    return shares.map((_,index)=>({month:`${row.month} W${index+1}`,spend:weeklySpend[index],budget:weeklyBudget[index],requests:weeklyRequests[index]}));
  });
}

export function getDepartmentMetrics(month, metric = 'users', provider = 'All providers') {
  const tools=getToolsForMonth(month,{provider});
  const fullSpend=getToolsForMonth(month).reduce((sum,tool)=>sum+tool.spend,0)||1;
  const providerShare=tools.reduce((sum,tool)=>sum+tool.spend,0)/fullSpend;
  const activeCount=Math.round(month.activeUsers*providerShare);
  const userValues=allocation(activeCount,departmentCatalog.map((item)=>item.activeUsers));
  const byDepartment=departmentCatalog.map((department,index)=>{
    const departmentTools=tools.filter((tool)=>tool.ownerDepartment===department.name);
    const spend=departmentTools.reduce((sum,tool)=>sum+tool.spend,0);
    const subscriptionSpend=departmentTools.filter((tool)=>tool.kind==='Subscription').reduce((sum,tool)=>sum+tool.spend,0);
    const apiSpend=departmentTools.filter((tool)=>tool.kind==='API consumption').reduce((sum,tool)=>sum+tool.spend,0);
    const tokens=departmentTools.reduce((sum,tool)=>sum+(tool.inputTokens||0)+(tool.outputTokens||0),0);
    const users=userValues[index];
    return {...department,users,activeUsers:users,spend,subscriptionSpend,apiSpend,tokens,value:metric==='spend'?spend:metric==='tokens'?tokens:users};
  });
  const mappedDepartments=new Set(departmentCatalog.map((department)=>department.name));
  const unattributedTools=tools.filter((tool)=>!mappedDepartments.has(tool.ownerDepartment));
  {
    const spend=unattributedTools.reduce((sum,tool)=>sum+tool.spend,0);
    const subscriptionSpend=unattributedTools.filter((tool)=>tool.kind==='Subscription').reduce((sum,tool)=>sum+tool.spend,0);
    const apiSpend=unattributedTools.filter((tool)=>tool.kind==='API consumption').reduce((sum,tool)=>sum+tool.spend,0);
    const tokens=unattributedTools.reduce((sum,tool)=>sum+(tool.inputTokens||0)+(tool.outputTokens||0),0);
    byDepartment.push({name:'Unattributed',users:null,activeUsers:null,spend,subscriptionSpend,apiSpend,tokens,value:metric==='spend'?spend:metric==='tokens'?tokens:null});
  }
  const totalSpend=tools.reduce((sum,tool)=>sum+tool.spend,0);
  const unattributedSpend=unattributedTools.reduce((sum,tool)=>sum+tool.spend,0);
  const attributionCoverage=totalSpend?1-unattributedSpend/totalSpend:1;
  byDepartment.forEach((row)=>{row.attributionCoverage=attributionCoverage;row.unattributedSpend=unattributedSpend;});
  return byDepartment;
}

export function getProviderSpend(month,{department='All departments'}={}) {
  const tools=getToolsForMonth(month,{department});
  return [...new Set(tools.map((tool)=>tool.provider))].map((provider)=>{const providerTools=tools.filter((tool)=>tool.provider===provider);return {provider,spend:providerTools.reduce((sum,tool)=>sum+tool.spend,0),monthlyLimit:providerTools.reduce((sum,tool)=>sum+tool.monthlyLimit,0)};}).sort((a,b)=>b.spend-a.spend);
}

export function getSummary(month,{department='All departments',provider='All providers',governanceOverrides={},departmentBudgetOverrides={}}={}) {
  const tools=getToolsForMonth(month,{department,provider,governanceOverrides});
  const spend=tools.reduce((sum,tool)=>sum+tool.spend,0);
  const subscriptionSpend=tools.filter((tool)=>tool.kind==='Subscription').reduce((sum,tool)=>sum+tool.spend,0);
  const apiSpend=tools.filter((tool)=>tool.kind==='API consumption').reduce((sum,tool)=>sum+tool.spend,0);
  const tokens=tools.reduce((sum,tool)=>sum+(tool.inputTokens||0)+(tool.outputTokens||0),0);
  const requests=tools.reduce((sum,tool)=>sum+(tool.requests||0),0);
  const allSpend=getToolsForMonth(month).reduce((sum,tool)=>sum+tool.spend,0)||1;
  const providerShare=provider==='All providers'?1:spend/allSpend;
  const departmentUsers=department==='All departments'?month.activeUsers:Math.round((departmentCatalog.find((item)=>item.name===department)?.activeUsers||0)*month.activeUsers/periodOptions.at(-1).activeUsers);
  const users=Math.round(departmentUsers*providerShare);
  const budget=department!=='All departments'?(departmentBudgetOverrides[department]??departmentCatalog.find((item)=>item.name===department)?.monthlyBudget??0):provider==='All providers'?45000:tools.reduce((sum,tool)=>sum+tool.monthlyLimit,0);
  return {spend,subscriptionSpend,apiSpend,users,toolCount:tools.length,tokens,requests,budget,approvedCount:tools.filter((tool)=>tool.governance==='Approved').length,reviewCount:tools.filter((tool)=>tool.governance!=='Approved').length};
}

export function getLicenseMetrics(month,{provider='All providers',department='All departments'}={}) {
  const factor=month.activeUsers/periodOptions.at(-1).activeUsers;
  return licenseCatalog.filter((license)=>(provider==='All providers'||license.provider===provider)&&(department==='All departments'||license.department===department)).map((license)=>{
    const active=Math.min(license.assigned,Math.round(license.active*factor));
    const inactiveAssigned=license.assigned-active;
    return {...license,active,inactiveAssigned,unassigned:license.purchased-license.assigned,utilization:license.purchased?active/license.purchased:0,estimatedMonthlySavings:inactiveAssigned*license.monthlySeatCost};
  });
}

export function getLicenseSummary(rows) {
  return rows.reduce((summary,license)=>({purchased:summary.purchased+license.purchased,assigned:summary.assigned+license.assigned,active:summary.active+license.active,inactiveAssigned:summary.inactiveAssigned+license.inactiveAssigned,unassigned:summary.unassigned+license.unassigned,estimatedMonthlySavings:summary.estimatedMonthlySavings+license.estimatedMonthlySavings}),{purchased:0,assigned:0,active:0,inactiveAssigned:0,unassigned:0,estimatedMonthlySavings:0});
}

export function getAnomalyAlerts(month,{department='All departments',provider='All providers'}={}) {
  const index=periodOptions.findIndex((item)=>item.month===month.month);
  if(index<1)return [];
  const previous=periodOptions[index-1];
  const providerNames=[...new Set(modelUsage.map((row)=>row.provider))];
  const anomalies=[];
  for(const source of providerNames){
    const current=getModelMetrics(month,{provider:source,department});
    const prior=getModelMetrics(previous,{provider:source,department});
    const currentRequests=current.reduce((sum,row)=>sum+row.requests,0);
    const previousRequests=prior.reduce((sum,row)=>sum+row.requests,0);
    const change=previousRequests?((currentRequests-previousRequests)/previousRequests)*100:0;
    if(change>=25&&(provider==='All providers'||provider===source)){
      const ownerDepartment=department==='All departments'?current[0]?.department:department;
      anomalies.push({id:`anomaly-${source.toLowerCase()}`,type:'Usage anomaly',severity:change>=50?'High':'Medium',title:`${source} API requests rose sharply`,department:ownerDepartment||'Organization',change:`+${change.toFixed(0)}%`,baseline:`${currentRequests.toLocaleString()} requests vs. ${previousRequests.toLocaleString()} in ${previous.month}`,tool:`${source} API`,recommendation:'Review the recent request volume, model mix, and project activity with the service owner. This signal needs investigation and does not indicate misuse.'});
    }
  }
  return anomalies;
}

export function getAlerts({month=periodOptions.at(-1),department='All departments',provider='All providers',departmentBudgetOverrides={},thresholds={approaching:.8,high:.9,reached:1}}={}) {
  const policies=alertCatalog.filter((alert)=>(department==='All departments'||alert.department===department||alert.department==='Organization')&&(provider==='All providers'||alert.tool.toLowerCase().includes(provider.toLowerCase())||alert.department==='Organization'));
  const budgetAlerts=departmentCatalog.filter((team)=>department==='All departments'||team.name===department).flatMap((team)=>{
    const spend=getToolsForMonth(month,{department:team.name,provider}).reduce((sum,tool)=>sum+tool.spend,0);
    const budget=departmentBudgetOverrides[team.name]??team.monthlyBudget;
    const ratio=budget?spend/budget:0;
    if(ratio<thresholds.approaching)return [];
    const severity=ratio>=thresholds.reached?'High':ratio>=thresholds.high?'Medium':'Low';
    return [{id:`budget-${team.name.toLowerCase().replaceAll(' ','-')}`,type:'Budget signal',severity,title:ratio>thresholds.reached?`${team.name} is over its sample budget`:ratio>=thresholds.reached?`${team.name} has reached its sample budget`:`${team.name} is nearing its sample budget`,department:team.name,change:`${Math.round(ratio*100)}% used`,baseline:`${formatMoneyForData(budget)} ${month.month} budget`,tool:'Multiple tools',recommendation:'Review department spend by tool and discuss any budget change with the budget owner.'}];
  });
  const anomalies=getAnomalyAlerts(month,{department,provider});
  const unusedAlerts=policies.filter((alert)=>alert.id==='alert-07').flatMap((alert)=>{
    const license=getLicenseMetrics(month,{provider,department}).find((item)=>item.product===alert.tool&&item.inactiveAssigned>0);
    return license?[{...alert,change:`${license.inactiveAssigned} seats inactive`,baseline:`assigned seats in the ${month.month} sample`,recommendation:'Confirm seat ownership and recent activity with the contract owner before considering reclamation.'}]:[];
  });
  const otherPolicies=policies.filter((alert)=>alert.id!=='alert-07');
  return [...anomalies,...budgetAlerts,...otherPolicies,...unusedAlerts];
}

export function getIntegrationMetrics({provider='All providers'}={}) {
  return integrationCatalog.filter((item)=>provider==='All providers'||item.provider===provider||item.provider==='Identity'||item.provider==='Finance');
}

export function searchInventory(query) {
  const value=query.trim().toLowerCase();
  if(!value)return {tools:[],teams:[]};
  return {tools:toolCatalog.filter((tool)=>[tool.name,tool.provider,tool.ownerDepartment,tool.governance].join(' ').toLowerCase().includes(value)).slice(0,5),teams:departmentCatalog.filter((team)=>team.name.toLowerCase().includes(value)).slice(0,5)};
}
