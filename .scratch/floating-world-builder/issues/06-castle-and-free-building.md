# 06: Unlock the castle and continue free building

Breakdown approved on 15 October 2026.

**What to build:** Decorating island two unlocks the special castle, completes the guided journey, and leaves the full world available for continued creative play.

**Blocked by:** 05 — Expand across the bridge through challenges 7–9.

**Status:** ready-for-agent

**Execution:** implemented and locally verified

- [x] Implement level 10 exactly on the second island: 1 cottage, 3 trees, 5 flowers, and 3 street lamps → special castle.
- [x] Show each requirement and count only objects on island two. Previously placed qualifying objects count without requiring extra edits.
- [x] Deliver the castle as a placeable decorative building with matching preview and normal movement/rotation/deletion/undo controls; no interiors or additional mechanics.
- [x] Ensure the second island can accommodate the castle's rotated footprint after rearrangement. An occupied placement is rejected clearly.
- [x] Celebrate briefly, then show an unobtrusive completed journey state; all items and both islands remain unlocked for free building.
- [x] Browser tests cover level 10, permanent castle unlock, valid/invalid castle placement, edited and reloaded completed worlds, and continued placement after the celebration.

**Demo:** Complete the last island checklist, place/rearrange the castle, and keep decorating after the finale.

**Spec coverage:** user stories 18, 19, 20, 21, 22, 24, 28, 29; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.


## Implementation evidence — 15 October 2026

Final island checklist, castle placement, completed-world reload and continued editing: game.spec.ts, journey.spec.ts, visual.spec.ts. See `docs/implementation-evidence.md` for exact test runs, measurements, limitations, and the user feedback fixes. These completion marks refer to local implementation and available-hardware verification; they do not assert a remote deployment or an unobserved human playtest.
