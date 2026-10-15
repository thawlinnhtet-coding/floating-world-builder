# 07: Build the windmill and pond garden through challenges 7–8

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** A windmill unlocks the pond; a pond with its surrounding flower garden reveals the fixed bridge into a cloud bank.

**Blocked by:** 06 — Build a cottage neighborhood through challenges 4–6.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Implement level 7: 1 windmill → pond; level 8: 1 pond with 5 qualifying nearby flowers → bridge.
- [ ] Deliver the windmill and placeable pond, including appropriate animation/materials and catalog previews. Ponds use ordinary footprints, not terrain excavation.
- [ ] Use the same explicit pond-area mask for highlighting and counting; all five flowers must qualify around one pond.
- [ ] After level 8 completes, show the fixed bridge automatically from the first island into clouds. The second island is still unavailable.
- [ ] Do not add a bridge inventory item, custom bridge placement, currency, waiting, or weather requirements.
- [ ] Browser tests verify the two unlocks, same-pond counting, existing garden recognition, persistence, and bridge visibility without premature island reveal.

**Demo:** Build a windmill, complete one pond garden, and see the bridge appear into the clouds.

**Spec coverage:** user stories 18, 19, 20, 21, 22, 23, 24, 25; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
