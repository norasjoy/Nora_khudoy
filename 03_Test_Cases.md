# ServiceDesk Flow — Test Cases

**Test run:** 17 October 2026  
**Environment:** Browser-based app with fictional sample tickets  
**Result meanings:** Pass = observed result matched expected result; Fail = observed result did not match expected result. No failures were observed in this run.

| Test ID | Test scenario | Expected result | Manual test steps | Actual result | Result | Change needed if failed |
|---|---|---|---|---|---|---|
| TC01 | High impact and high urgency ticket | Priority is Critical | In the browser console, evaluate `calculatePriority("High", "High", "One user")`. | Returned `P1` (Critical). | Pass | — |
| TC02 | High impact and medium urgency ticket | Priority is High | In the browser console, evaluate `calculatePriority("High", "Medium", "One user")`. | Returned `P2` (High). | Pass | — |
| TC03 | Open ticket past its deadline | Overdue indicator appears | Open the dashboard and find an active ticket whose deadline has passed, such as SD-2481. | SD-2481 is open and shows “Response overdue.” | Pass | — |
| TC04 | Ticket deadline is in the future | Ticket is not overdue | Find SD-2468 and check its response target. | SD-2468 shows “Within target”; no overdue indicator appears. | Pass | — |
| TC05 | Select Critical in the priority filter | Only Critical tickets appear | Select `P1 · Critical` in the priority filter and inspect each visible priority badge. | Only P1 · Critical tickets appeared. | Pass | — |
| TC06 | Change Open to In Progress | Status and dashboard counts update | Clear filters. Change SD-2477 from New to In Progress. Compare status counts before and after. | SD-2477 changed to In Progress; New count changed from 3 to 2, In Progress from 2 to 3, and the active count remained 7. | Pass | — |
| TC07 | Clear all filters | All tickets appear again | After applying filters, set both priority and status filters to their “All” options. | All 8 tickets appeared again. | Pass | — |
| TC08 | No tickets match a filter | Empty state message appears | Select `P1 · Critical` and `Resolved` together. | No rows appeared and the “No tickets match these filters” message appeared. | Pass | — |
| TC09 | Already Resolved ticket whose original deadline has passed | Resolved ticket is not marked as an overdue open ticket | Clear filters and inspect SD-2465, which is Resolved and has a past response deadline. | SD-2465 shows “Resolved” and has no “Response overdue” indicator. It is excluded from active and overdue totals. | Pass | — |
