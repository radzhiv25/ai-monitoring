// Fictional data used only by this prototype. No provider or employee systems are connected.
export const periodOptions = [
  { month: 'Jun', year: 2025, activeUsers: 412, usageFactor: 1.02, apiUsageFactor: 0.68 },
  { month: 'Jul', year: 2025, activeUsers: 429, usageFactor: 1.15, apiUsageFactor: 0.74 },
  { month: 'Aug', year: 2025, activeUsers: 441, usageFactor: 1.08, apiUsageFactor: 0.81 },
  { month: 'Sep', year: 2025, activeUsers: 453, usageFactor: 1.22, apiUsageFactor: 0.87 },
  { month: 'Oct', year: 2025, activeUsers: 472, usageFactor: 1.16, apiUsageFactor: 0.95 },
  { month: 'Nov', year: 2025, activeUsers: 486, usageFactor: 1, apiUsageFactor: 1.28 },
];

// The November sample totals $31,710. All earlier monthly values are calculated from these tool values.
export const toolCatalog = [
  { id:'chatgpt-enterprise', name:'ChatGPT Enterprise', provider:'OpenAI', kind:'Subscription', ownerDepartment:'Engineering', users:284, monthlySpend:9600, monthlyLimit:12000, governance:'Approved', renewal:'Dec 18, 2025' },
  { id:'github-copilot', name:'GitHub Copilot', provider:'GitHub', kind:'Subscription', ownerDepartment:'Engineering', users:176, monthlySpend:5200, monthlyLimit:7000, governance:'Approved', renewal:'Jan 04, 2026' },
  { id:'claude-team', name:'Claude Team', provider:'Anthropic', kind:'Subscription', ownerDepartment:'Product & Design', users:92, monthlySpend:3900, monthlyLimit:5000, governance:'Approved', renewal:'Dec 02, 2025' },
  { id:'midjourney', name:'Midjourney', provider:'Midjourney', kind:'Subscription', ownerDepartment:'Marketing', users:38, monthlySpend:860, monthlyLimit:1500, governance:'Approved', renewal:'Dec 12, 2025' },
  { id:'openai-api', name:'OpenAI API', provider:'OpenAI', kind:'API consumption', ownerDepartment:'Engineering', users:31, monthlySpend:3400, monthlyLimit:4500, governance:'Approved', renewal:'Usage based' },
  { id:'anthropic-api', name:'Anthropic API', provider:'Anthropic', kind:'API consumption', ownerDepartment:'Product & Design', users:18, monthlySpend:2300, monthlyLimit:3500, governance:'Approved', renewal:'Usage based' },
  { id:'gemini-api', name:'Gemini API', provider:'Google', kind:'API consumption', ownerDepartment:'Sales', users:12, monthlySpend:800, monthlyLimit:1500, governance:'Approved', renewal:'Usage based' },
  { id:'gemini-workspace', name:'Gemini for Workspace', provider:'Google', kind:'Subscription', ownerDepartment:'Sales', users:71, monthlySpend:1200, monthlyLimit:2000, governance:'Approved', renewal:'Jan 15, 2026' },
  { id:'microsoft-copilot', name:'Microsoft Copilot', provider:'Microsoft', kind:'Subscription', ownerDepartment:'Sales', users:64, monthlySpend:1500, monthlyLimit:2500, governance:'Approved', renewal:'Jan 10, 2026' },
  { id:'perplexity-enterprise', name:'Perplexity Enterprise', provider:'Perplexity', kind:'Subscription', ownerDepartment:'Marketing', users:25, monthlySpend:500, monthlyLimit:1000, governance:'Approved', renewal:'Dec 30, 2025' },
  { id:'cursor', name:'Cursor', provider:'Cursor', kind:'Subscription', ownerDepartment:'Engineering', users:53, monthlySpend:1050, monthlyLimit:1800, governance:'Review needed', renewal:'Dec 22, 2025' },
  { id:'notion-ai', name:'Notion AI', provider:'Notion', kind:'Subscription', ownerDepartment:'Other', users:47, monthlySpend:450, monthlyLimit:900, governance:'Review needed', renewal:'Jan 02, 2026' },
  { id:'runway', name:'Runway', provider:'Runway', kind:'Subscription', ownerDepartment:'Marketing', users:22, monthlySpend:950, monthlyLimit:1200, governance:'Review needed', renewal:'Dec 19, 2025' },
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

export const employeeUsageBaselines = [
  { employeeId:'emp-001', provider:'OpenAI', department:'Engineering', currentTokens:1250000, baselineTokens:830000, window:'previous 30 days' },
];

export const integrationCatalog = [
  { id:'int-openai', name:'OpenAI admin + usage', provider:'OpenAI', status:'Healthy', lastSync:'Nov 14, 2025 · 09:12', coverage:['API spend','Requests','Input/output tokens'], coveragePercent:96 },
  { id:'int-anthropic', name:'Anthropic Console', provider:'Anthropic', status:'Delayed', lastSync:'Nov 14, 2025 · 01:45', coverage:['API spend','Requests','Input/output tokens'], coveragePercent:82 },
  { id:'int-google', name:'Google Workspace + Gemini', provider:'Google', status:'Healthy', lastSync:'Nov 14, 2025 · 08:58', coverage:['Subscription spend','API usage'], coveragePercent:91 },
  { id:'int-identity', name:'Workforce identity directory', provider:'Identity', status:'Partial data', lastSync:'Nov 13, 2025 · 23:10', coverage:['User and department mapping'], coveragePercent:76 },
  { id:'int-billing', name:'Finance and procurement', provider:'Finance', status:'Healthy', lastSync:'Nov 14, 2025 · 06:30', coverage:['Subscription invoices','Budgets'], coveragePercent:88 },
];

export const alertCatalog = [
  { id:'alert-02', severity:'High', title:'Unreviewed AI app detected', department:'Marketing', change:'First seen Nov 12', baseline:'No prior activity in connected discovery data', tool:'Runway', recommendation:'Confirm business need and data handling with the Marketing owner.' },
  { id:'alert-04', severity:'Medium', title:'Usage is concentrated in a small group', department:'Product & Design', change:'Top 5 users: 58%', baseline:'of observed department API tokens', tool:'Anthropic API', recommendation:'Check whether usage is expected for the current project.' },
  { id:'alert-05', severity:'Low', title:'Provider data arrived late', department:'Organization', change:'Last sync 7 hours ago', baseline:'Expected sync interval: 4 hours', tool:'Anthropic', recommendation:'Treat Anthropic usage as incomplete until the next successful sync.' },
  { id:'alert-06', severity:'Low', title:'Tool ownership needs confirmation', department:'Other', change:'2 owners missing', baseline:'in the sample inventory', tool:'Notion AI', recommendation:'Confirm the responsible team before applying a policy.' },
  { id:'alert-07', severity:'Low', title:'Potential unused subscription', department:'Marketing', change:'Low activity', baseline:'for 2 consecutive sample months', tool:'Perplexity Enterprise', recommendation:'Review seats and renewal details with the contract owner.' },
];

export const employees = [
  { id:'emp-001', name:'Maya Chen', department:'Engineering', role:'Staff Engineer', tools:['ChatGPT Enterprise','GitHub Copilot','OpenAI API'], activeDays:22, monthlySpend:1040 },
  { id:'emp-002', name:'Arjun Rao', department:'Engineering', role:'Engineering Manager', tools:['GitHub Copilot','OpenAI API'], activeDays:19, monthlySpend:780 },
  { id:'emp-003', name:'Priya Shah', department:'Product & Design', role:'Product Designer', tools:['Claude Team','Anthropic API'], activeDays:16, monthlySpend:410 },
  { id:'emp-004', name:'Noah Williams', department:'Marketing', role:'Content Lead', tools:['Midjourney','Runway'], activeDays:13, monthlySpend:260 },
  { id:'emp-005', name:'Sofia Martinez', department:'Sales', role:'Account Executive', tools:['Gemini for Workspace','Microsoft Copilot'], activeDays:17, monthlySpend:180 },
  { id:'emp-006', name:'Ethan Kim', department:'Other', role:'Operations Analyst', tools:['Notion AI'], activeDays:8, monthlySpend:42 },
];

export const formatMoney = (value) => `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
