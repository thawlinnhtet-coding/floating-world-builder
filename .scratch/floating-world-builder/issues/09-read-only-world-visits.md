# 09: Explore shared worlds as a read-only visitor

Breakdown approved on 15 October 2026.

**What to build:** A direct world link reads a validated D1 snapshot through the Worker and opens a read-only 3D visitor view with temporary atmosphere and screenshot controls.

**Blocked by:** 08 — Capture clean screenshots and tune graphics.

**Status:** ready-for-agent

**Execution:** implemented and locally verified

- [x] Implement public GET /api/worlds/{publicId} backed by local D1. Use a deterministic seeded publication to demonstrate the complete read path before owner creation ships.
- [x] Return only validated public snapshot data and public metadata; never expose ownership tokens/hashes, private backup metadata, or edit history.
- [x] Support direct /world/{publicId} navigation and reload through SPA routing. Render the supported models, islands, bridge, and published atmosphere.
- [x] Isolate the visitor session from the browser's editable-world slot. Hide building/progression/publishing/management actions and prevent visitor mutations.
- [x] Provide camera controls, temporary weather/time overrides, and clean screenshots; overrides never change the publication or local editable save.
- [x] Show clear loading, missing/deleted, incompatible, and temporary-service-failure states, with retry when appropriate.
- [x] Add direct Worker/D1 integration coverage for reads and data exposure, plus browser tests for deep links, isolation, read-only behavior, temporary overrides, and screenshots.

**Demo:** Open a seeded direct link in a browser with an existing local world, explore and change the view, then return to the untouched local world.

**Spec coverage:** user stories 51, 52, 53, 54, 58; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.


## Implementation evidence — 15 October 2026

Real snapshot GET, direct route, isolated visitor atmosphere and local-world preservation: api.spec.ts, game.spec.ts, recovery.spec.ts. See `docs/implementation-evidence.md` for exact test runs, measurements, limitations, and the user feedback fixes. These completion marks refer to local implementation and available-hardware verification; they do not assert a remote deployment or an unobserved human playtest.
