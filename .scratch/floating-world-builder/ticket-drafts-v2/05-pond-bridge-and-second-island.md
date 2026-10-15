# 05: Expand across the bridge through challenges 7–9

Draft revision 2 for breakdown review. Not published to the implementation tracker.

**What to build:** Players build a windmill and pond garden, reveal the fixed bridge into clouds, decorate its entrance, and unlock a fully editable second island.

**Blocked by:** 04 — Build a cottage garden through challenges 1–6.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

### Build the windmill and pond garden through challenges 7–8

- [ ] Implement level 7: 1 windmill → pond; level 8: 1 pond with 5 qualifying nearby flowers → bridge.
- [ ] Deliver the windmill and placeable pond, including appropriate animation/materials and catalog previews. Ponds use ordinary footprints, not terrain excavation.
- [ ] Use the same explicit pond-area mask for highlighting and counting; all five flowers must qualify around one pond.
- [ ] After level 8 completes, show the fixed bridge automatically from the first island into clouds. The second island is still unavailable.
- [ ] Do not add a bridge inventory item, custom bridge placement, currency, waiting, or weather requirements.
- [ ] Browser tests verify the two unlocks, same-pond counting, existing garden recognition, persistence, and bridge visibility without premature island reveal.

### Complete the scenic entrance and reveal island two

- [ ] Implement level 9 exactly: at least 2 street lamps and 5 flowers in the highlighted first-island bridge entrance mask → second floating island.
- [ ] Use identical masks for progress counts and visible accepted areas; unrelated decorations elsewhere do not qualify.
- [ ] Reveal the fixed second island at the far end of the bridge with a brief cloud transition. Terrain and occupancy validation allow it only after unlock.
- [ ] Use the same placement, selection, movement, rotation, deletion, undo, and camera controls across both islands.
- [ ] Persist reveal/progression state; reload and undo retain the earned expansion. Adjust camera bounds to make both islands inspectable.
- [ ] Browser tests cover mask boundaries, correct reveal order, saved expansion, cross-island editing, and rejection of placement before unlock.

**Demo:** Complete the pond garden, watch the bridge appear, decorate its entrance, reveal island two, and build there using the same tools.

**Spec coverage:** user stories 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 36; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.

**Scope note:** Combines the related journeys from former draft tickets 07 and 08, preserving their acceptance and verification requirements. Implement the acceptance groups consecutively within one ticket; no extra subsystem or general refactor is requested.
