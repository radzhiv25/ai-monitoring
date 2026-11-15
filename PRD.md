# PRD: budget exceptions for AI tools

## Goal

Help an IT lead understand spend against limits and make a timely, auditable decision on a temporary budget request. Finance should be able to scan expenditure and remaining budget without reading token telemetry.

## MVP stories and acceptance criteria

### Department owner sets a limit

- A department budget can be edited in the prototype’s local policy/detail view.
- Spend is compared with the configured limit at the selected sample period.
- Updating a department limit does not silently update the organization total or a tool’s limit.

### Employee requests additional budget

- The request names a tool or department, amount, required reason, duration, and optional context.
- The form validates the amount, reason, selection, and custom end date.
- The request shows current spend/limit, requester, route, and expiry in the request history.

### Approver reviews a request

- Requests at or below a configurable threshold route to a department lead; larger requests route to IT or Finance.
- Approve and reject require a comment and record an approver role and decision timestamp.
- Approval creates a separate temporary allocation; it does not rewrite the base budget or claim provider quota enforcement.
- Pending requests can be cancelled. An approved temporary allocation can be marked expired in the prototype. Each action appears in local activity history.

### Finance reviews expenditure

- The overview shows total spend against the organization limit with subscription and API amounts separated.
- The department chart separates subscription and API cost and reports attribution coverage.
- The tool chart compares observed cost to each tool’s own limit and identifies remaining allocation.

## Budget hierarchy

Organization, department, and tool limits are independent configured values. A temporary approved exception is a fourth, separate allocation with an approver and expiry. Raising a tool limit does not raise its department budget; approving an exception does not raise the organization budget. If a tool and its department exceed their own limits, show both constraints and leave the resolution to IT or Finance.

## Thresholds and enforcement

Default sample thresholds are 80% approaching, 90% high utilization, 100% reached, and above 100% over limit. The detailed Limit policy panel lets a user adjust these local values. The run-rate estimate is hidden for the first seven cycle days to avoid a noisy early ratio. Alerts and approval routing are workflow signals. They do not mean that a provider supports or has applied a spending block.

## Data and privacy

Missing usage is “Unavailable,” never zero. Unattributed spend remains a separate category and is not distributed. People charts are department-level aggregates; no browsing history or individual usage timelines are in scope. Requester identity is displayed only as workflow context.

## Success measures to validate

- Time from request submission to decision.
- Share of requests with a recorded reason and decision note.
- Number of exceptions that expire or are renewed intentionally.
- Share of measured spend attributed to a department.
- Budget-owner ability to identify the team/tool driving an approaching limit.

These are proposed measures, not observed results from this prototype.
