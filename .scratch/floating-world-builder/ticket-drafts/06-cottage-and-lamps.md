# 06: Build a cottage neighborhood through challenges 4–6

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** Players build a cottage, arrange fences in its highlighted area, and add street lamps to unlock the windmill.

**Blocked by:** 05 — Grow the starter garden through challenges 1–3.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Implement level 4: 1 cottage → fences; level 5: 6 fence sections around the same cottage → street lamps; level 6: 3 street lamps → windmill.
- [ ] Deliver production cottage, fence, and lamp models and matching previews consistent with the approved natural miniature-world direction.
- [ ] Use one explicit grid mask for both cottage-area highlighting and fence qualification. Partial counts around different cottages cannot be pooled.
- [ ] Apply the shared placement/editing rules to actual rotated multi-cell footprints; allow moving or removing the target without corrupting progression.
- [ ] Counts and highlights respond to committed changes only; previous work counts immediately, and rewards remain permanent through undo or rearrangement.
- [ ] Browser tests cover all three transitions, same-target proximity, outside-mask rejection, multi-cell boundary/collision handling, rotations, and saved unlocks.

**Demo:** Select the highlighted cottage area, complete its fence requirement, then place three lamps and unlock a windmill.

**Spec coverage:** user stories 10, 11, 18, 19, 20, 21, 22, 23, 24; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
