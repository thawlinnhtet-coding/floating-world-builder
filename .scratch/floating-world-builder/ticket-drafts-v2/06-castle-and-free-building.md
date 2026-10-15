# 06: Unlock the castle and continue free building

Draft revision 2 for breakdown review. Not published to the implementation tracker.

**What to build:** Decorating island two unlocks the special castle, completes the guided journey, and leaves the full world available for continued creative play.

**Blocked by:** 05 — Expand across the bridge through challenges 7–9.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Implement level 10 exactly on the second island: 1 cottage, 3 trees, 5 flowers, and 3 street lamps → special castle.
- [ ] Show each requirement and count only objects on island two. Previously placed qualifying objects count without requiring extra edits.
- [ ] Deliver the castle as a placeable decorative building with matching preview and normal movement/rotation/deletion/undo controls; no interiors or additional mechanics.
- [ ] Ensure the second island can accommodate the castle's rotated footprint after rearrangement. An occupied placement is rejected clearly.
- [ ] Celebrate briefly, then show an unobtrusive completed journey state; all items and both islands remain unlocked for free building.
- [ ] Browser tests cover level 10, permanent castle unlock, valid/invalid castle placement, edited and reloaded completed worlds, and continued placement after the celebration.

**Demo:** Complete the last island checklist, place/rearrange the castle, and keep decorating after the finale.

**Spec coverage:** user stories 18, 19, 20, 21, 22, 24, 28, 29; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.

**Scope note:** Retains the bounded journey from former draft ticket 09.
