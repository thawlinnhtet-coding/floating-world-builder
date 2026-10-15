# 09: Explore shared worlds as a read-only visitor

Draft revision 2 for breakdown review. Not published to the implementation tracker.

**What to build:** A direct world link reads a validated D1 snapshot through the Worker and opens a read-only 3D visitor view with temporary atmosphere and screenshot controls.

**Blocked by:** 08 — Capture clean screenshots and tune graphics.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Implement public GET /api/worlds/{publicId} backed by local D1. Use a deterministic seeded publication to demonstrate the complete read path before owner creation ships.
- [ ] Return only validated public snapshot data and public metadata; never expose ownership tokens/hashes, private backup metadata, or edit history.
- [ ] Support direct /world/{publicId} navigation and reload through SPA routing. Render the supported models, islands, bridge, and published atmosphere.
- [ ] Isolate the visitor session from the browser's editable-world slot. Hide building/progression/publishing/management actions and prevent visitor mutations.
- [ ] Provide camera controls, temporary weather/time overrides, and clean screenshots; overrides never change the publication or local editable save.
- [ ] Show clear loading, missing/deleted, incompatible, and temporary-service-failure states, with retry when appropriate.
- [ ] Add direct Worker/D1 integration coverage for reads and data exposure, plus browser tests for deep links, isolation, read-only behavior, temporary overrides, and screenshots.

**Demo:** Open a seeded direct link in a browser with an existing local world, explore and change the view, then return to the untouched local world.

**Spec coverage:** user stories 51, 52, 53, 54, 58; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.

**Scope note:** Retains the bounded journey from former draft ticket 14.
