# Product brief: AI budgets, limits, and exceptions

## Problem

AI spend and limits are spread across product subscriptions, API consumption, departmental budgets, and provider reports. An IT owner can discover an overage late, while a team with a legitimate need has no clear path to ask for a temporary exception.

## Primary user

The IT lead responsible for the organization’s AI program. Finance gets a concise view of spend, remaining allocation, and exceptions; department leads review requests routed to their teams.

## Product hypothesis

A shared budget and exception-management workflow can make AI spending easier to control while giving employees a timely, accountable way to request more capacity.

## Questions the workspace answers

1. Is current AI spend within the organization’s budget?
2. Which departments are approaching their allocation?
3. Which tools are approaching their own limits?
4. Which assigned subscriptions have no recent observed activity?
5. Which requests are waiting for a decision, and what did the approver decide?
6. Which spend is not attributed to an owner?

## Proposed charts

- **Spend vs department limit:** actual spend, the configured limit, and a clearly labeled run-rate estimate help decide whether to approve an exception or investigate an overage. The estimate appears after day 7 and uses spend to date ÷ elapsed cycle days × cycle days.
- **Department spend by type:** stacked subscription and API spend helps Finance and IT compare allocation needs while keeping unattributed spend visible.
- **Tool spend vs tool limit:** paired bars show actual cost against a tool-specific cap; the inventory gives utilization, remaining amount, and status for the next action.

## Scope and boundaries

The dashboard is the operating experience. Budget requests are the proposed differentiator. This repository is a frontend prototype with fictional sample data; local decisions do not update providers, budgets, or employee access. It has no browsing history or individual usage timeline. Provider enforcement is not implied by a warning or hard-cap setting.

See [PRD.md](./PRD.md), [DATA_INTEGRATION.md](./DATA_INTEGRATION.md), and [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) for acceptance criteria, source assumptions, and trade-offs.
