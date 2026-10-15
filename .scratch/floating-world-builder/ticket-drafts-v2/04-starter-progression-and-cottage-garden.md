# 04: Build a cottage garden through challenges 1–6

Draft revision 2 for breakdown review. Not published to the implementation tracker.

**What to build:** Players grow from trees-only building into a furnished cottage garden by completing the exact first six challenges, unlocking rocks, flowers, cottages, fences, lamps, and finally the windmill.

**Blocked by:** 03 — Edit safely and recover your world.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

### Grow the starter garden through challenges 1–3

- [ ] Implement exactly levels 1–3: 3 trees → rocks; 3 rocks → flowers; 5 flowers → cottage. Add consistent natural models and catalog previews for rocks and flowers.
- [ ] Show active requirement counts and locked reward requirements using the approved compact challenge summary and expanded details.
- [ ] Evaluate progression only on committed layout changes and valid restoration. Immediately re-evaluate existing objects against each newly active challenge, including consecutive already-satisfied steps.
- [ ] Persist completed levels and unlocks separately from reversible layout history. Deletion, movement, and undo never revoke earned rewards.
- [ ] Keep catalog copies unlimited within terrain/occupancy and the later shared measured cap. Add brief, restrained completion and unlock feedback.
- [ ] Browser tests cover every transition, locked-item prevention, pre-existing qualifying objects, permanence after undo/delete, and restoration at each step.

### Build a cottage neighborhood through challenges 4–6

- [ ] Implement level 4: 1 cottage → fences; level 5: 6 fence sections around the same cottage → street lamps; level 6: 3 street lamps → windmill.
- [ ] Deliver production cottage, fence, and lamp models and matching previews consistent with the approved natural miniature-world direction.
- [ ] Use one explicit grid mask for both cottage-area highlighting and fence qualification. Partial counts around different cottages cannot be pooled.
- [ ] Apply the shared placement/editing rules to actual rotated multi-cell footprints; allow moving or removing the target without corrupting progression.
- [ ] Counts and highlights respond to committed changes only; previous work counts immediately, and rewards remain permanent through undo or rearrangement.
- [ ] Browser tests cover all three transitions, same-target proximity, outside-mask rejection, multi-cell boundary/collision handling, rotations, and saved unlocks.

**Demo:** Play the first six challenges, use the highlighted cottage mask, undo/rearrange a qualifying layout, and reload with permanent earned unlocks.

**Spec coverage:** user stories 7, 10, 11, 18, 19, 20, 21, 22, 23, 24, 36; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.

**Scope note:** Combines the related journeys from former draft tickets 05 and 06, preserving their acceptance and verification requirements. Implement the acceptance groups consecutively within one ticket; no extra subsystem or general refactor is requested.
