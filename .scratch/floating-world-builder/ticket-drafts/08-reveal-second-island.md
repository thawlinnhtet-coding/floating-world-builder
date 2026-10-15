# 08: Complete the scenic entrance and reveal island two

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** Players decorate the highlighted bridge entrance with two lamps and five flowers, reveal the second island, and build on it with the existing tools.

**Blocked by:** 07 — Build the windmill and pond garden through challenges 7–8.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Implement level 9 exactly: at least 2 street lamps and 5 flowers in the highlighted first-island bridge entrance mask → second floating island.
- [ ] Use identical masks for progress counts and visible accepted areas; unrelated decorations elsewhere do not qualify.
- [ ] Reveal the fixed second island at the far end of the bridge with a brief cloud transition. Terrain and occupancy validation allow it only after unlock.
- [ ] Use the same placement, selection, movement, rotation, deletion, undo, and camera controls across both islands.
- [ ] Persist reveal/progression state; reload and undo retain the earned expansion. Adjust camera bounds to make both islands inspectable.
- [ ] Browser tests cover mask boundaries, correct reveal order, saved expansion, cross-island editing, and rejection of placement before unlock.

**Demo:** Finish the entrance, watch the second island emerge, place an object there, and restore it after reload.

**Spec coverage:** user stories 19, 20, 23, 24, 26, 27, 36; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
