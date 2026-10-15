# 04: Build a cottage garden through challenges 1–6

Breakdown approved on 15 October 2026.

**What to build:** Players grow from trees-only building into a furnished cottage garden by completing the exact first six challenges, unlocking rocks, flowers, cottages, fences, lamps, and finally the windmill.

**Blocked by:** 03 — Edit safely and recover your world.

**Status:** ready-for-agent

**Execution:** implemented and locally verified

### Grow the starter garden through challenges 1–3

- [x] Implement exactly levels 1–3: 3 trees → rocks; 3 rocks → flowers; 5 flowers → cottage. Add consistent natural models and catalog previews for rocks and flowers.
- [x] Show active requirement counts and locked reward requirements using the approved compact challenge summary and expanded details.
- [x] Evaluate progression only on committed layout changes and valid restoration. Immediately re-evaluate existing objects against each newly active challenge, including consecutive already-satisfied steps.
- [x] Persist completed levels and unlocks separately from reversible layout history. Deletion, movement, and undo never revoke earned rewards.
- [x] Keep catalog copies unlimited within terrain/occupancy and the later shared measured cap. Add brief, restrained completion and unlock feedback.
- [x] Browser tests cover every transition, locked-item prevention, pre-existing qualifying objects, permanence after undo/delete, and restoration at each step.

### Build a cottage neighborhood through challenges 4–6

- [x] Implement level 4: 1 cottage → fences; level 5: 6 fence sections around the same cottage → street lamps; level 6: 3 street lamps → windmill.
- [x] Deliver production cottage, fence, and lamp models and matching previews consistent with the approved natural miniature-world direction.
- [x] Use one explicit grid mask for both cottage-area highlighting and fence qualification. Partial counts around different cottages cannot be pooled.
- [x] Apply the shared placement/editing rules to actual rotated multi-cell footprints; allow moving or removing the target without corrupting progression.
- [x] Counts and highlights respond to committed changes only; previous work counts immediately, and rewards remain permanent through undo or rearrangement.
- [x] Browser tests cover all three transitions, same-target proximity, outside-mask rejection, multi-cell boundary/collision handling, rotations, and saved unlocks.

**Demo:** Play the first six challenges, use the highlighted cottage mask, undo/rearrange a qualifying layout, and reload with permanent earned unlocks.

**Spec coverage:** user stories 7, 10, 11, 18, 19, 20, 21, 22, 23, 24, 36; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.


## Implementation evidence — 15 October 2026

Exact levels 1–6, same-cottage fence counting, permanent unlocks: game.spec.ts and the continuous journey.spec.ts. See `docs/implementation-evidence.md` for exact test runs, measurements, limitations, and the user feedback fixes. These completion marks refer to local implementation and available-hardware verification; they do not assert a remote deployment or an unobserved human playtest.
