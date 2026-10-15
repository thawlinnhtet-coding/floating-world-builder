# Triage labels

Map the engineering skills' five canonical triage roles to local tracker status strings.

| Canonical role | Local tracker status | Meaning |
|---|---|---|
| `needs-triage` | `needs-triage` | A maintainer needs to evaluate the issue. |
| `needs-info` | `needs-info` | More information is needed before work can proceed. |
| `ready-for-agent` | `ready-for-agent` | Fully specified and ready for agent implementation. |
| `ready-for-human` | `ready-for-human` | Requires human implementation. |
| `wontfix` | `wontfix` | Will not be actioned. |

When a skill requests a triage label, set the corresponding `Status:` line near the top of the local spec or ticket. No remote labels need to be created.
