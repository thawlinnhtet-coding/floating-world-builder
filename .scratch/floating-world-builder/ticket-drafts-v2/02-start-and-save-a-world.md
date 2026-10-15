# 02: Start, build, and restore a first island

Draft revision 2 for breakdown review. Not published to the implementation tracker.

**What to build:** A new player opens the production game, places trees on one empty island, explores it, and returns after reload to the same locally saved world. Rebuild the approved refined A+C interface for production; the prototype is a visual reference, not the game engine.

**Blocked by:** None (can start immediately).

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Start without registration, with one empty fixed island, trees only, visible locked rewards, and the first challenge guidance. Do not start from the prototype's decorated two-island fixture.
- [ ] Provide smooth orbit, zoom, pan, suitable limits, and adaptive framing. Camera drags do not commit placement; unsupported WebGL 2 produces a useful message.
- [ ] Choose a tree, preview its snapped grid position and validity, reject occupied/out-of-bounds cells, and allow repeated placement. Escape and a visible Explore/cancel action exit placement.
- [ ] Use stable object identifiers, island-relative coordinates, quarter-turn orientation, and a versioned serializable world contract rather than saving meshes or transient UI state.
- [ ] Autosave committed changes through IndexedDB with ordered writes; restore valid data on startup. Show saving/saved/failure states truthfully and keep the in-memory world usable on storage failure.
- [ ] Use the approved single build dock, actual-model previews, narrow-window catalog paging, grouped header actions, and compact expandable challenge summary. Initial progress is descriptive until the progression slice lands.
- [ ] Add the minimum browser integration harness and verify first launch, valid/invalid/repeated placement, gesture separation, cancel, save ordering, and reload through visible UI and durable outcomes.

**Demo:** Place several trees, orbit without adding another tree, reload, and find the same layout.

**Spec coverage:** user stories 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 17, 36, 37, 58; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.

**Scope note:** Retains the bounded journey from former draft ticket 02.
