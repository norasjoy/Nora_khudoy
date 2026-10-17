# Service Desk Ticket Prioritisation Dashboard

Repository: `Nora_khudoy`

## Purpose

Provide analysts with a dashboard that makes ticket priority, response deadlines, and the active workload visible so they can review and manage service desk tickets.

## Workflow context

### AS IS — hypothesis to validate

This is a working hypothesis, not a confirmed description of an actual service desk team's process. Validate it with analysts before treating it as the current-state process:

1. A ticket is received.
2. An analyst reviews the ticket manually.
3. The analyst decides its priority.
4. Work is assigned and tracked.

### TO BE — proposed process

1. A ticket appears in the dashboard.
2. The system calculates its priority and response deadline.
3. The analyst reviews the priority reason and any overdue indicator.
4. The analyst updates the ticket status and monitors the active ticket queue.

## First release

Open `index.html` in a browser. The dashboard uses fictional sample tickets held in page memory; status changes are available during the current page session and are not saved after refresh. There is no backend or external data connection.

## Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR01 | Display a list of tickets with key details. | Must have |
| FR02 | Calculate priority using documented business rules. | Must have |
| FR03 | Show the reason for each calculated priority. | Must have |
| FR04 | Identify overdue response targets. | Must have |
| FR05 | Filter tickets by priority and status. | Must have |
| FR06 | Sort tickets by priority and response deadline. | Must have |
| FR07 | Allow the user to update ticket status. | Must have |
| FR08 | Show ticket counts by status and priority. | Should have |
| FR09 | Save updates between browser sessions. | Later enhancement |

## Demo business rules

These rules make the first release usable with fictional data. They are assumptions for demonstration and must be confirmed with service desk stakeholders before production use.

### Priority rules

The priority calculation uses all three inputs: business impact, urgency, and affected users. First, impact and urgency produce a base priority:

| Business impact \ Urgency | High | Medium | Low |
|---|---:|---:|---:|
| High | Critical | High | High |
| Medium | High | Medium | Medium |
| Low | Medium | Low | Low |

Then the affected-user scope escalates that base priority by a fixed number of levels:

| Affected users | Escalation |
|---|---:|
| One user | 0 levels |
| A team | 1 level |
| The whole organization | 2 levels |

Priority levels, from lowest to highest, are `Low`, `Medium`, `High`, and `Critical`. Escalation stops at `Critical`; it can never exceed that level. For example, high impact + high urgency + one user is Critical; high impact + medium urgency + one user is High; low impact + high urgency + one user is Medium; low impact + low urgency + a team is Medium; low impact + low urgency + the whole organization is High.

The dashboard reason shows the impact, urgency, affected-user scope, and any escalation from the base priority. This is a proposed demonstration rule set, not a universal IT service management standard; confirm it with stakeholders before production use.

### Response target and overdue definition

| Priority | Response target |
|---|---:|
| P1 · Critical | 1 elapsed hour |
| P2 · High | 4 elapsed hours |
| P3 · Medium | 8 elapsed hours |
| P4 · Low | 24 elapsed hours |

The deadline is the ticket creation time plus its calculated priority's target, measured in continuous elapsed hours (not a business-hours calendar). A ticket is overdue when the current time is later than its deadline and its status is not Resolved. The overdue indicator does not change the calculated priority. These targets identify a response deadline; they do not claim that a response was or was not actually sent.

## Included dashboard behavior

- View ticket key details, impact, urgency, affected users, calculated priority and reason, response deadline, and status.
- Filter by priority and status, and sort by priority or response deadline.
- Update status and see the status/priority counts and overdue total recalculate.
- See active-ticket and overdue-response totals. Resolved tickets are excluded from the active and overdue totals.

Status updates live only in browser memory for this release. Persisting them between browser sessions (FR09) is deferred.

## Acceptance criteria

### FR01 — Ticket list

- **Given** the dashboard is opened, **when** the sample tickets load, **then** each ticket shows its ID, title, requester, team, impact, urgency, affected-user scope, calculated priority, priority reason, response deadline, and status.

### FR02 — Priority calculation

- **Given** a ticket with high business impact, high urgency, and one affected user, **when** priority is calculated, **then** it is Critical.
- **Given** a ticket with high business impact, medium urgency, and one affected user, **when** priority is calculated, **then** it is High.
- **Given** a ticket with medium business impact, high urgency, and one affected user, **when** priority is calculated, **then** it is High.
- **Given** a ticket with medium business impact, medium urgency, and one affected user, **when** priority is calculated, **then** it is Medium.
- **Given** a ticket with low business impact, low urgency, and one affected user, **when** priority is calculated, **then** it is Low.
- **Given** a ticket with low business impact, high urgency, and one affected user, **when** priority is calculated, **then** it is Medium.
- **Given** any impact/urgency combination, **when** the audience is a team or the whole organization, **then** the base priority rises by one or two levels respectively, stopping at Critical.

### FR03 — Priority reason

- **Given** a ticket, **when** its calculated priority is displayed, **then** the reason identifies its impact, urgency, affected-user scope, and any scope-based escalation.

### FR04 — Overdue response target

- **Given** an unresolved ticket whose response deadline is earlier than the current time, **when** the dashboard loads, **then** it is marked “Response overdue.”
- **Given** an overdue ticket, **when** its overdue indicator is shown, **then** its calculated priority remains the result of the three-input priority rules and is not increased due to lateness.
- **Given** a ticket whose deadline is equal to or later than the current time, **when** the dashboard loads, **then** it is not marked overdue.
- **Given** a ticket with Resolved status, **when** the dashboard loads, **then** it is not counted or marked as overdue.

### FR05 — Filters

- **Given** tickets with different priorities or statuses, **when** the analyst selects a priority or status filter, **then** only tickets matching every selected filter are shown; **when** the filter is cleared, **then** matching tickets are shown again.

### FR06 — Sorting

- **Given** multiple tickets, **when** the analyst selects priority sorting, **then** tickets are ordered Critical, High, Medium, Low, with earlier deadlines first within a priority.
- **Given** multiple tickets, **when** the analyst selects response-deadline sorting, **then** tickets are ordered by earliest deadline first.

### FR07 — Status update

- **Given** an active ticket, **when** the analyst changes its status to In Progress, **then** the displayed status and status counts update; **when** the analyst changes it to Resolved, **then** active and overdue totals exclude it.

### FR08 — Counts

- **Given** the ticket list, **when** the dashboard loads or a status changes, **then** status counts and priority counts equal the corresponding tickets in the full list.
