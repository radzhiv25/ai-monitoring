// Fictional data used only by this prototype. No provider or employee systems are connected.
export const periodOptions = [
  { month: 'Jun', year: 2026, activeUsers: 412, usageFactor: 1.02, apiUsageFactor: 0.68 },
  { month: 'Jul', year: 2026, activeUsers: 429, usageFactor: 1.15, apiUsageFactor: 0.74 },
  { month: 'Aug', year: 2026, activeUsers: 441, usageFactor: 1.08, apiUsageFactor: 0.81 },
  { month: 'Sep', year: 2026, activeUsers: 453, usageFactor: 1.22, apiUsageFactor: 0.87 },
  { month: 'Oct', year: 2026, activeUsers: 472, usageFactor: 1.16, apiUsageFactor: 0.95 },
  { month: 'Nov', year: 2026, activeUsers: 486, usageFactor: 1, apiUsageFactor: 1.28 },
];

// The month snapshot is represented as spend to day 21; the run-rate uses this elapsed-day count.
export const sampleCycleDay = 21;
// November totals $32,310: $25,210 subscription costs and $7,100 API costs, including $600 unattributed API spend.
export const toolCatalog = [
  { id:'chatgpt-enterprise', name:'ChatGPT Enterprise', provider:'OpenAI', kind:'Subscription', ownerDepartment:'Engineering', users:284, monthlySpend:9600, monthlyLimit:12000, governance:'Approved', renewal:'Dec 18, 2026' },
  { id:'github-copilot', name:'GitHub Copilot', provider:'GitHub', kind:'Subscription', ownerDepartment:'Engineering', users:176, monthlySpend:5200, monthlyLimit:7000, governance:'Approved', renewal:'Jan 04, 2026' },
  { id:'claude-team', name:'Claude Team', provider:'Anthropic', kind:'Subscription', ownerDepartment:'Product & Design', users:92, monthlySpend:3900, monthlyLimit:5000, governance:'Approved', renewal:'Dec 02, 2026' },
  { id:'midjourney', name:'Midjourney', provider:'Midjourney', kind:'Subscription', ownerDepartment:'Marketing', users:38, monthlySpend:860, monthlyLimit:1500, governance:'Approved', renewal:'Dec 12, 2026' },
  { id:'openai-api', name:'OpenAI API', provider:'OpenAI', kind:'API consumption', ownerDepartment:'Engineering', users:31, monthlySpend:3400, monthlyLimit:4500, governance:'Approved', renewal:'Usage based' },
  { id:'anthropic-api', name:'Anthropic API', provider:'Anthropic', kind:'API consumption', ownerDepartment:'Product & Design', users:18, monthlySpend:2300, monthlyLimit:3500, governance:'Approved', renewal:'Usage based' },
  { id:'gemini-api', name:'Gemini API', provider:'Google', kind:'API consumption', ownerDepartment:'Sales', users:12, monthlySpend:800, monthlyLimit:1500, governance:'Approved', renewal:'Usage based' },
  { id:'gemini-workspace', name:'Gemini for Workspace', provider:'Google', kind:'Subscription', ownerDepartment:'Sales', users:71, monthlySpend:1200, monthlyLimit:2000, governance:'Approved', renewal:'Jan 15, 2026' },
  { id:'microsoft-copilot', name:'Microsoft Copilot', provider:'Microsoft', kind:'Subscription', ownerDepartment:'Sales', users:64, monthlySpend:1500, monthlyLimit:2500, governance:'Approved', renewal:'Jan 10, 2026' },
  { id:'perplexity-enterprise', name:'Perplexity Enterprise', provider:'Perplexity', kind:'Subscription', ownerDepartment:'Marketing', users:25, monthlySpend:500, monthlyLimit:1000, governance:'Approved', renewal:'Dec 30, 2026' },
  { id:'cursor', name:'Cursor', provider:'Cursor', kind:'Subscription', ownerDepartment:'Engineering', users:53, monthlySpend:1050, monthlyLimit:1800, governance:'Review needed', renewal:'Dec 22, 2026' },
  { id:'notion-ai', name:'Notion AI', provider:'Notion', kind:'Subscription', ownerDepartment:'Other', users:47, monthlySpend:450, monthlyLimit:900, governance:'Review needed', renewal:'Jan 02, 2026' },
  { id:'runway', name:'Runway', provider:'Runway', kind:'Subscription', ownerDepartment:'Marketing', users:22, monthlySpend:950, monthlyLimit:1200, governance:'Review needed', renewal:'Dec 19, 2026' },
  { id:'openrouter-api', name:'OpenRouter API', provider:'OpenRouter', kind:'API consumption', ownerDepartment:null, users:0, monthlySpend:600, monthlyLimit:1200, governance:'Review needed', renewal:'Usage based', usageDataAvailable:false },
];

// Local request history is deliberately small so the exception workflow is visible on first use.
export const budgetRequestCatalog = [
  { id:'REQ-1042', target:'tool:github-copilot', toolName:'GitHub Copilot', provider:'GitHub', scope:'Tool', department:'Engineering', currentBudget:7000, currentSpend:5200, amount:1200, reason:'Temporary capacity for the CI migration work.', context:'The migration is scheduled to finish before this cycle closes.', duration:'This cycle only', route:'a team lead', requester:'Priya Shah · Engineering', approver:'Engineering team lead', submittedAt:'2026-11-14T08:10:00.000Z', status:'Pending approval', decisionComments:'', expiresAt:'2026-11-30' },
  { id:'REQ-1036', target:'tool:openai-api', toolName:'OpenAI API', provider:'OpenAI', scope:'Tool', department:'Engineering', currentBudget:4500, currentSpend:3400, amount:900, reason:'Short-term API capacity for the migration test suite.', context:'Usage will be reviewed before renewal.', duration:'This cycle only', route:'a team lead', requester:'Maya Chen · Engineering', approver:'Engineering team lead', submittedAt:'2026-11-12T12:20:00.000Z', status:'Approved', decisionComments:'Approved for the migration test window; review usage before the next cycle.', decidedAt:'2026-11-13T09:00:00.000Z', expiresAt:'2026-11-30' },
  { id:'REQ-1028', target:'department:Marketing', toolName:'Marketing department budget', provider:'Multiple tools', scope:'Department', department:'Marketing', currentBudget:7000, currentSpend:2310, amount:1800, reason:'Additional video render credits requested for a campaign.', context:'', duration:'This cycle only', route:'a team lead', requester:'Noah Williams · Marketing', approver:'Marketing team lead', submittedAt:'2026-11-10T10:00:00.000Z', status:'Rejected', decisionComments:'Please confirm the campaign allocation with Finance before requesting a top-up.', decidedAt:'2026-11-11T15:30:00.000Z', expiresAt:'2026-11-30' },
];
export const temporaryExceptionCatalog = [
  { id:'exception-REQ-1036', requestId:'REQ-1036', scope:'Tool', target:'OpenAI API', department:'Engineering', amount:900, approver:'Engineering team lead', startsAt:'2026-11-13T09:00:00.000Z', expiresAt:'2026-11-30', status:'Active' },
];
export const auditEventCatalog = [
  { id:'event-req-1042', actor:'Priya Shah · Engineering', action:'Exception requested', resource:'GitHub Copilot · $1,200', timestamp:'2026-11-14T08:10:00.000Z' },
  { id:'event-req-1036', actor:'Engineering team lead', action:'Exception approved', resource:'OpenAI API · $900', timestamp:'2026-11-13T09:00:00.000Z', note:'Approved for the migration test window; review usage before the next cycle.' },
  { id:'event-req-1028', actor:'Marketing team lead', action:'Exception rejected', resource:'Marketing department budget · $1,800', timestamp:'2026-11-11T15:30:00.000Z', note:'Please confirm the campaign allocation with Finance before requesting a top-up.' },
];

export const departmentCatalog = [
  { name:'Engineering', activeUsers:185, share:37, color:'#7766e8', monthlyBudget:20000 },
  { name:'Product & Design', activeUsers:117, share:25, color:'#40b89b', monthlyBudget:11000 },
  { name:'Marketing', activeUsers:92, share:16, color:'#f2a76f', monthlyBudget:7000 },
  { name:'Sales', activeUsers:58, share:13, color:'#76a9e8', monthlyBudget:5000 },
  { name:'Other', activeUsers:34, share:9, color:'#d4d8e1', monthlyBudget:2000 },
];

export const modelUsage = [
  { model:'GPT-4o', provider:'OpenAI', department:'Engineering', requests:150000, inputTokens:9000000, outputTokens:3200000, monthlyCost:2100 },
  { model:'GPT-5', provider:'OpenAI', department:'Engineering', requests:96000, inputTokens:5800000, outputTokens:2200000, monthlyCost:1300 },
  { model:'Claude Sonnet', provider:'Anthropic', department:'Product & Design', requests:64000, inputTokens:4000000, outputTokens:1500000, monthlyCost:1750 },
  { model:'Claude Opus', provider:'Anthropic', department:'Product & Design', requests:18000, inputTokens:1100000, outputTokens:600000, monthlyCost:550 },
  { model:'Gemini Pro', provider:'Google', department:'Sales', requests:42000, inputTokens:2400000, outputTokens:1300000, monthlyCost:800 },
];

export const licenseCatalog = [
  { id:'lic-chatgpt', product:'ChatGPT Enterprise', provider:'OpenAI', department:'Engineering', purchased:320, assigned:300, active:274, monthlySeatCost:30 },
  { id:'lic-copilot', product:'GitHub Copilot', provider:'GitHub', department:'Engineering', purchased:220, assigned:190, active:176, monthlySeatCost:19 },
  { id:'lic-claude', product:'Claude Team', provider:'Anthropic', department:'Product & Design', purchased:120, assigned:105, active:92, monthlySeatCost:25 },
  { id:'lic-gemini', product:'Gemini for Workspace', provider:'Google', department:'Sales', purchased:100, assigned:90, active:75, monthlySeatCost:20 },
  { id:'lic-microsoft', product:'Microsoft Copilot', provider:'Microsoft', department:'Sales', purchased:80, assigned:65, active:58, monthlySeatCost:30 },
  { id:'lic-perplexity', product:'Perplexity Enterprise', provider:'Perplexity', department:'Marketing', purchased:40, assigned:36, active:15, monthlySeatCost:12 },
];

export const integrationCatalog = [
  { id:'int-openai', name:'OpenAI admin + usage', provider:'OpenAI', status:'Healthy', lastSync:'Nov 21, 2026 · 09:12', coverage:['API spend','Requests','Input/output tokens'], coveragePercent:96 },
  { id:'int-anthropic', name:'Anthropic Console', provider:'Anthropic', status:'Delayed', lastSync:'Nov 14, 2026 · 01:45', coverage:['API spend','Requests','Input/output tokens'], coveragePercent:82 },
  { id:'int-google', name:'Google Workspace + Gemini', provider:'Google', status:'Healthy', lastSync:'Nov 14, 2026 · 08:58', coverage:['Subscription spend','API usage'], coveragePercent:91 },
  { id:'int-identity', name:'Workforce identity directory', provider:'Identity', status:'Partial data', lastSync:'Nov 13, 2026 · 23:10', coverage:['User and department mapping'], coveragePercent:76 },
  { id:'int-billing', name:'Finance and procurement', provider:'Finance', status:'Healthy', lastSync:'Nov 14, 2026 · 06:30', coverage:['Subscription invoices','Budgets'], coveragePercent:88 },
];

export const alertCatalog = [
  { id:'alert-02', severity:'High', title:'Unreviewed AI app detected', department:'Marketing', change:'First seen Nov 12', baseline:'No prior activity in connected discovery data', tool:'Runway', recommendation:'Confirm business need and data handling with the Marketing owner.' },
  { id:'alert-04', severity:'Medium', title:'API usage is concentrated in a small key group', department:'Product & Design', change:'Top 5 keys: 58%', baseline:'of observed department API tokens', tool:'Anthropic API', recommendation:'Confirm that the key owners and project allocation are appropriate.' },
  { id:'alert-05', severity:'Low', title:'Provider data arrived late', department:'Organization', change:'Last sync 7 hours ago', baseline:'Expected sync interval: 4 hours', tool:'Anthropic', recommendation:'Treat Anthropic usage as incomplete until the next successful sync.' },
  { id:'alert-06', severity:'Low', title:'Tool ownership needs confirmation', department:'Other', change:'2 owners missing', baseline:'in the sample inventory', tool:'Notion AI', recommendation:'Confirm the responsible team before applying a policy.' },
  { id:'alert-07', severity:'Low', title:'Potential unused subscription', department:'Marketing', change:'Low activity', baseline:'for 2 consecutive sample months', tool:'Perplexity Enterprise', recommendation:'Review seats and renewal details with the contract owner.' },
];

export const formatMoney = (value) => `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
