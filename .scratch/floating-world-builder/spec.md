# Floating World Builder — MVP Specification

Date: 15 October 2026

Status: ready-for-agent

Scope approval: Product scope, core stack, and both testing boundaries agreed.

Tracker: Local Markdown

Issue title: Build Floating World Builder MVP

Triage label: ready-for-agent

## Problem Statement

Casual creative players want a relaxing way to build an attractive miniature world without resource grinding, survival pressure, building timers, or the complexity of a full construction simulation. An empty sandbox can also leave new players unsure where to begin.

Players need clear placement controls, gentle guidance, reliable recovery from mistakes, and persistent progress. Once they have created something personal, they need a straightforward way to capture it and invite someone else to explore it.

## Solution

Create a free, desktop-browser 3D building game with a cozy, natural miniature-world visual style. Players begin with an empty floating island and trees unlocked. Ten sequential challenges introduce decorations and buildings, reveal a bridge and second island, and finish by unlocking a special castle. Players can then continue decorating freely.

Use predefined island terrain, grid-based object placement, unlimited copies of unlocked catalog items subject to space and a measured performance limit, and reversible editing. Weather and time change the atmosphere without imposing gameplay penalties.

The editable world automatically saves locally without an account. Explicit publishing creates a cloud-backed, read-only snapshot at a unique link. Visitors can explore and adjust their viewing atmosphere without changing the owner's world.

The first playtest succeeds when a new player can place and rearrange objects without help, understand the next challenge, and voluntarily personalize the island within ten minutes. Completing all challenges alone is not sufficient evidence that the creative loop is enjoyable.

## User Stories

1. As a new player, I want to start playing without registering, so that I can begin creating immediately.
2. As a new player, I want a clear first challenge and an initially small catalog, so that the empty island does not feel overwhelming.
3. As a player, I want to rotate the camera smoothly, so that I can inspect every side of my world.
4. As a player, I want to zoom and pan, so that I can work on details and view both islands.
5. As a player, I want camera gestures to be distinct from editing actions, so that exploring does not accidentally move buildings.
6. As a builder, I want to select an unlocked item from a catalog, so that I can choose what to add.
7. As a builder, I want to see upcoming locked items and their unlock requirements, so that progression is understandable.
8. As a builder, I want a grid and placement preview while building, so that I can predict where an item will go.
9. As a builder, I want invalid locations to be clearly marked, so that I understand why placement is blocked.
10. As a builder, I want objects to respect island boundaries and other objects' footprints, so that layouts remain predictable.
11. As a builder, I want to rotate objects in 90-degree steps, so that I can align them with my scene.
12. As a builder, I want to place repeated copies without reopening the catalog, so that creating a garden or fence is quick.
13. As a builder, I want to cancel placement with Escape or a visible control, so that I can return to exploring easily.
14. As a builder, I want clicking an existing object to reveal move, rotate, and delete actions, so that editing is discoverable.
15. As a builder, I want to cancel an object move without changing its original position, so that experimentation feels safe.
16. As a builder, I want session undo and redo for placement, movement, rotation, and deletion, so that mistakes are easy to recover from.
17. As a builder, I want unlimited copies of each unlocked item within space and performance limits, so that I can experiment without grinding.
18. As a builder, I want trees, rocks, flowers, cottages, fences, street lamps, windmills, ponds, and a castle, so that I can compose varied miniature scenes.
19. As a player, I want exactly ten sequential challenges, so that the guided progression has a clear beginning and end.
20. As a player, I want visible requirement counts for my active challenge, so that I know what remains to do.
21. As a player, I want existing objects to count toward a newly active challenge, so that previous creative work is recognized.
22. As a player, I want earned unlocks to remain after I rearrange or delete objects, so that progression does not restrict redesigning.
23. As a player, I want nearby-decoration challenges to highlight their accepted areas, so that words such as garden and scenic have clear rules.
24. As a player, I want challenge completion and new rewards to receive a small visual acknowledgment, so that progression feels satisfying.
25. As a player, I want the bridge to appear when unlocked, so that my world visibly expands toward a new destination.
26. As a player, I want the second island to emerge from clouds at the end of the bridge, so that its unlock feels like a reveal.
27. As a builder, I want to decorate both islands with the same editing tools, so that expansion does not require learning new controls.
28. As a builder, I want the castle to be placeable and movable, so that I can choose how to use my final reward.
29. As a player, I want a short final celebration followed by unrestricted decorating, so that finishing the challenges opens creative play.
30. As a player, I want sunny, cloudy, rainy, and snowy weather, so that the same world can have different moods.
31. As a player, I want weather particles and atmospheric changes to transition smoothly, so that changing conditions feel pleasant.
32. As a player, I want automatic weather and manual weather selection, so that I can either relax or choose a specific atmosphere.
33. As a player, I want an automatic day/night cycle and manual time controls, so that I can enjoy changing light or frame a particular scene.
34. As a player, I want sun and moon lighting, stars, and glowing lamps at night, so that nighttime remains attractive and readable.
35. As a player, I want weather and time to affect appearance only, so that I never have to repair damage or wait for a challenge condition.
36. As a returning player, I want my layout, unlocks, progress, and settings restored automatically, so that I can continue where I left off.
37. As a player, I want a clear indication when saving fails, so that I do not mistake unsaved work for a durable save.
38. As a player, I want to export a backup, so that I can protect my world and publishing ownership from browser-data loss.
39. As a player, I want to import a valid backup, so that I can restore my world or move it to another browser.
40. As a player, I want malformed or incompatible imports to leave my current world intact, so that restoration attempts do not destroy progress.
41. As a player, I want confirmation and a backup opportunity before resetting my world, so that a destructive action is deliberate.
42. As a creator, I want screenshot mode to hide the interface while retaining camera control, so that I can compose an image.
43. As a creator, I want a clear capture action that downloads a PNG without interface controls, so that I can share a clean picture.
44. As a creator, I want screenshot capture to work without publishing, so that I control what becomes publicly accessible.
45. As a creator, I want to publish the current world explicitly, so that I choose when others can see it.
46. As a creator, I want to update a published snapshot without changing its public link, so that existing invitations remain useful.
47. As a creator, I want ordinary editing and autosaving to stay local, so that visitors see only the version I deliberately publish.
48. As a creator, I want an owner-only unpublish action, so that I can remove a published snapshot.
49. As a creator, I want publishing ownership to be included in my private backup, so that I can retain control after restoring it.
50. As a creator, I want a clear explanation of anonymous ownership and its recovery limits, so that I understand why my backup matters.
51. As a visitor, I want a unique link to open the published 3D world without an account, so that visiting is simple.
52. As a visitor, I want camera controls, temporary weather/time changes, and screenshots, so that I can explore the world in my own way.
53. As an owner, I want visitors to be unable to modify or delete my publication, so that sharing does not grant editing access.
54. As a visitor, I want a clear response to an unavailable or unpublished world, so that a broken link does not look like a frozen game.
55. As a player, I want local editing and saving to continue if the connection drops after the game has loaded, so that network problems do not interrupt building.
56. As a player on a slower laptop, I want adjustable shadows and weather particles, so that I can trade visual detail for responsiveness.
57. As a project owner, I want a complete playable loop with beginner-friendly setup and free-plan deployment, so that I can build and share the MVP with a constrained budget.
58. As a maintainer, I want versioned world data and clear rules for loading it, so that later releases can preserve existing players' work.

## Implementation Decisions

### 1. Baseline and terminology

- The inspected workspace contains no application code, package manifests, existing tests, domain glossary, or ADRs. This is a greenfield implementation; there are no existing test seams or modules to preserve.
- A **world** is the player's single editable local project, including layout, progression, and settings.
- A **catalog item** is an object type unlocked for placement, not a consumable stock quantity.
- An **object** is one placed instance of a catalog item.
- A **publication** is the owner's cloud-backed snapshot with a public identifier and private ownership credential.
- A **visitor session** explores a publication and cannot edit its stored snapshot.
- A **challenge** is one active step in the ten-step progression. Completion and unlocks are permanent until a deliberate reset.

### 2. Agreed stack and module boundaries

- Use React, TypeScript, and Vite for the application and build tooling.
- Use Three.js through React Three Fiber for 3D rendering, with selected Drei utilities for camera and scene support.
- Use Zustand for editable application state. Keep frame-by-frame animation updates in the rendering loop rather than continuously updating React or persistent game state.
- Use IndexedDB through idb for local persistence.
- Use Cloudflare Workers Static Assets to serve the compiled game, a small Worker HTTP API for publishing, and D1 for persistent published-world records.
- Use ordinary CSS for the minimal interface unless an implementation need justifies additional styling tooling.
- Keep logical responsibilities clear without introducing a general game engine or extensible plugin system: world editing and progression; rendering and interaction; persistence and data validation; publication service; and the React interface.
- Treat the serializable world model as the shared contract. Do not use the Three.js scene graph or meshes as the save format.

### 3. Catalog, terrain, and progression

- Start with one empty fixed island and only trees unlocked. Rocks are the first reward, not a starting item.
- Use the following exact initial challenge ladder. Quantities can be tuned after playtesting, but implementation must initially match this table.

| Level | Challenge | Measurable completion rule | Unlock reward |
|---|---|---|---|
| 1 | Plant 3 trees | At least 3 trees in the world | Rocks |
| 2 | Place 3 rocks | At least 3 rocks in the world | Flowers |
| 3 | Create a garden with 5 flowers | At least 5 flowers in the world | Cottage |
| 4 | Build your first cottage | At least 1 cottage in the world | Fences |
| 5 | Decorate the cottage with fences | At least 6 fence sections in the highlighted area around a cottage | Street lamps |
| 6 | Place 3 street lamps | At least 3 street lamps in the world | Windmill |
| 7 | Build a windmill | At least 1 windmill in the world | Pond |
| 8 | Create a pond and garden area | At least 1 pond with 5 flowers in its highlighted surrounding area | Bridge |
| 9 | Complete a scenic bridge area | At least 2 street lamps and 5 flowers in the highlighted bridge entrance area | Second floating island |
| 10 | Decorate the second island | At least 1 cottage, 3 trees, 5 flowers, and 3 street lamps on the second island | Special castle |

- For levels 5 and 8, all required nearby decorations must qualify around the same cottage or pond. Do not combine partial counts from unrelated locations. Highlight the qualifying target and its area in the active challenge UI.
- Define proximity areas as explicit grid masks tied to the island layout or target footprint. Use the same masks for counting and highlighting. Their exact dimensions are a layout-tuning choice, not a second hidden completion rule.
- Evaluate the active challenge after a committed layout change and after restoring a world. Once it completes, activate the next challenge and evaluate existing objects against that step. Continue through already-satisfied consecutive steps without requiring artificial new placement actions.
- Preserve completed levels and rewards when objects are deleted, moved, or undone. Undo restores layout edits, not earned progression.
- No challenge requires specific weather, time, waiting, currency, or an aesthetic judgment.
- The bridge is fixed and appears automatically after level 8. It extends from the first island into a cloud bank. The second island reveals at the far end after level 9.
- Players decorate ground around the bridge entrance; the bridge does not need a separate object-placement or custom construction system.
- Both islands have fixed buildable masks. Ponds are placeable objects, not terrain excavation.
- The castle is a larger decorative building with the normal editing controls and no interiors. Ensure the second island's usable area can accommodate its footprint; players may need to rearrange an occupied area before placing it.
- Do not add pine variants or flower-color rewards from the superseded draft ladder. The user's revised ladder above is authoritative.
- Completing level 10 produces a brief celebration and leaves every catalog item and both islands available for free decorating.

### 4. Placement and editing behavior

- Store object positions as island-relative grid coordinates and orientations as quarter-turn rotations. Give every placed instance a stable identifier.
- Catalog definitions provide the item identifier, rotated footprints, procedural appearance, and unlock relationship.
- Prevent placement outside buildable terrain or overlapping occupied footprints. Use logical grid occupancy; a rigid-body physics engine is unnecessary for this behavior.
- Show a translucent placement preview, temporary building grid, and clear valid/invalid feedback before committing an action.
- Selecting a catalog item enters repeat placement mode. Escape and a visible cancel action return to exploration.
- Clicking a placed object selects it and exposes move, rotate, and delete. Moving uses a preview; cancellation retains the original object position.
- Commit only valid edits. Drag previews and canceled actions must not affect challenge counts, autosaves, or undo history.
- Support undo and redo for committed placement, move, rotation, and deletion in the current session. A new edit after undo clears the redo branch. Reloading resets session history while retaining the saved world.
- Centralize editing actions so collision checks, challenge evaluation, history, and persistence observe the same committed result.
- Use distinct camera gestures and click/drag thresholds so camera movement does not accidentally place or move objects. Keep camera controls available while building.

### 5. Rendering, atmosphere, and performance

- Use a consistent code-generated, semi-realistic miniature-world art style. Preserve rich natural color while replacing visibly faceted cartoon forms with branching leafy trees, textured grass, irregular rocky cliffs and trailing plants, terracotta roof tiles, timber and plaster cottages, reflective pond water, atmospheric clouds, and soft daylight/shadows. Keep warm cream interface panels and restrained placement/unlock animations. This art-direction revision follows the request for a more realistic appearance after reviewing the colorful A+C prototype.
- Follow the refined A+C interface direction: one persistent build dock with category tabs, previews rendered from the actual 3D objects, paging controls when needed, and editing tools in the same dock. Keep a compact expandable challenge summary, group world identity and atmosphere/sharing at the top, and remove redundant decorative captions and item-quantity badges. Keep small labels readable against the brighter world. The prototype captures this visual direction; production behavior still follows the full specification.
- Use the Three.js WebGL 2 renderer. Detect unsupported graphics capability and show a useful message instead of a blank canvas.
- Support smooth rotation, zoom, and pan with suitable limits for inspecting both islands.
- Implement sunny, cloudy, rainy, and snowy conditions with smoothly blended atmospheric effects and animated particles where appropriate.
- Enable automatic weather and day/night transitions by default. Expose immediate manual overrides and an explicit return to automatic control.
- Include sun/moon lighting, nighttime stars, and glowing lamps. Weather and time are cosmetic: no damage, blocked placement, or progression penalties.
- Save atmosphere controls and the selected viewing state. Published snapshots open with the owner's published atmosphere; visitor overrides exist only in that visitor session.
- Reuse geometry and materials where practical. Use instancing or similarly efficient rendering for repeated objects when measurement justifies it.
- Provide adjustable shadow and particle detail. Establish an object cap through representative laptop testing; do not promise an untested count or frame rate.
- Cap validation applies consistently to placement, imported worlds, and publications. Communicate the cap when it prevents adding an object.

### 6. World data and local persistence

- Use versioned, validated, plain JSON world data. Persist a local world identifier, scene/layout version or deterministic seed, placed objects, permanent challenge completion, unlocks, bridge/island reveal state, atmosphere settings, and relevant user settings.
- Derive redundant progression flags where possible and validate their consistency on load. Keep transient previews, current selection, GPU resources, animation frame state, and session undo history out of durable saves.
- Use one local editable-world slot. Restore it at startup after validation and any supported schema migration.
- Autosave after committed edits and meaningful setting/progression changes. Serialize or order writes so an older asynchronous write cannot overwrite a newer state.
- Show saving, saved, and failure states accurately. Storage failure must leave the current in-memory world usable and provide an export option.
- Export a downloadable backup with the world data and, when present, the private publication-management information. Explain that the backup can grant control over the publication and should remain private.
- Validate imported data and run supported migrations before replacing the current world. Reject unknown future schemas and malformed data without damaging the current save. Offer confirmation and an export opportunity before replacing it.
- Reset requires confirmation and offers a backup first. Reset the local layout and progression while retaining the existing publication-management credential, so the owner does not accidentally lose control of a snapshot that remains online. Reset alone must not update or remove that snapshot.
- Browser storage is not a guarantee against user deletion or eviction. Backups are the recovery path; there is no account-based recovery in this MVP.

### 7. Publication data and ownership

- Publishing and updating are explicit actions. Ordinary building and autosaving do not make server requests.
- Store a stable public publication identifier, validated versioned snapshot JSON, creation/update timestamps, and only a hash of a high-entropy private ownership token in D1.
- Generate ownership credentials using cryptographically secure randomness, retain them locally and in private backups, and verify authorization server-side for updates and deletion.
- Keep public snapshot data separate from local editor state. Never include ownership tokens, token hashes, private backup metadata, or editing history in a public API response or public download.
- Public snapshot data includes what the renderer needs: supported scene version, objects, island/bridge reveal state, and the owner's selected atmosphere. Accept catalog identifiers and validated data, not arbitrary executable content or remote asset URLs.
- Make initial publication retry-safe. Persist the credential and creation request identity locally before attempting creation, and support safe retry after an interrupted response without duplicate or orphaned publications.
- Updating replaces the snapshot at the same public identifier and link. A failed update retains the previously published snapshot and the current local editable world.
- Unpublishing removes public access and invalidates management of that deleted publication. A subsequent publish can create a new public identifier. Confirm deletion in the owner interface.
- Restoring a backup with valid management information restores the ability to update or unpublish its publication. Restoring scene data without that information does not prove ownership.
- Explain at first publish that losing both browser data and the private backup means losing update/unpublish access. Public visiting links never recover ownership.

### 8. HTTP contracts

The following contracts are proposed engineering decisions for the agreed publishing behavior. API routes below identify HTTP resources, not source-code locations.

| Operation | Contract | Authorization and result |
|---|---|---|
| Create publication | POST /api/worlds | Accept a validated public snapshot, ownership setup, and creation idempotency information; return the public identifier/link. Apply creation abuse controls. |
| Read publication | GET /api/worlds/{publicId} | Public access; return only validated public snapshot data and public metadata. |
| Update publication | PUT /api/worlds/{publicId} | Require the private owner bearer token; atomically replace the snapshot while retaining the public identifier. |
| Unpublish | DELETE /api/worlds/{publicId} | Require the private owner bearer token; remove public access. |

- Return clear outcomes for malformed or oversized input, unsupported data versions, failed ownership checks, missing publications, rate limits, and temporary service failures. Do not treat a server failure as successful publication.
- Missing and wrong credentials cannot update or delete a world. A public identifier alone confers no ownership.
- Never put the private token in the public URL, analytics, or application logs. Use HTTPS for remote API traffic.
- Enforce request-size, object-count, catalog, coordinate, rotation, and terrain constraints server-side. Reject invalid input before writing it.
- Add basic abuse throttling for anonymous writes. Do not expose unrestricted database-write capabilities to the browser.
- Keep publishing independent of the local save transaction so network failure cannot roll back local progress.

### 9. Sharing routes and visitor mode

- Serve a direct public world URL such as /world/{publicId}. Support direct navigation and reload through static SPA routing, and route API requests to the Worker.
- A shared-world route loads a publication into an isolated read-only visitor session. Opening a link must not overwrite the visitor's own locally saved editable world.
- Expose camera controls, temporary weather/time changes, and screenshot capture. Hide building, progression, publishing, and owner-management actions in visitor mode.
- Do not persist visitor overrides into the publication or the visitor's editable-world slot.
- Handle missing, unpublished, incompatible, and temporarily unavailable worlds with clear loading/error states and a retry where appropriate.
- Visiting does not include copying another person's world into an editable save.

### 10. Screenshot capture

- Screenshot mode hides the normal interface, leaves camera interaction available, and shows only a clear capture action and an exit action.
- The downloaded PNG contains the rendered scene without catalog, challenge, capture, or exit controls.
- Capture the current camera, atmosphere, and visible effects. Screenshot capture works for owners and visitors and does not require publication.
- Generate and download images in the browser. Do not upload PNGs to D1 or introduce a screenshot-hosting service.
- Ensure the capture implementation renders a complete frame without requiring a permanent rendering configuration that unnecessarily harms normal play performance.

### 11. Free-plan operation and setup

- Target Cloudflare Workers Free and D1 Free initially. Do not promise indefinite free operation at arbitrary usage levels.
- Current verified limits include unlimited static asset requests; 100,000 dynamic Worker requests per day; 10 milliseconds of Worker CPU per invocation; 500 MB per free D1 database; and 5 million rows read plus 100,000 rows written per day. Account-wide quotas and row/index accounting also apply.
- A single D1 row/string/blob has a documented 2 MB maximum. Set a conservative snapshot/request limit below this limit and avoid storing media in the database.
- Free-plan quota exhaustion can make publication operations and shared-world loading unavailable. Daily quota resets do not resolve full storage. Preserve local editing and saves and explain publication failure accurately.
- Route static files so ordinary asset requests need not execute the publishing Worker. Measure API CPU usage, snapshot sizes, and database operations under representative conditions.
- Provide beginner-friendly local setup, run/build instructions, local publication API/database development, deployment configuration, and database migration steps. Actual remote deployment requires the project owner's Cloudflare account and configured resources; player accounts are not required.
- No paid assets or paid hosting are prerequisites for the initial build. No delivery deadline or specific development schedule was agreed.

## Testing Decisions

The user approved both test boundaries below during the expectation check required by the to-spec workflow. This is the agreed testing approach, not a report of tests already run; there is no implementation yet.

### What makes a good test

- Assert externally visible behavior and durable outcomes: rendered controls, placement acceptance/rejection, exported scene data, restored progress, public API results, and authorization boundaries.
- Avoid assertions about React component structure, Zustand internals, private helper calls, mesh construction order, or exact procedural vertex counts.
- Exercise production behavior through the highest useful boundary. Prefer normal UI actions and the existing import/export and publication contracts over test-only state injection or a new abstraction layer.
- Use deterministic world fixtures, clocks, and atmosphere settings where a scenario needs repeatability. Keep subjective art-quality review separate from deterministic rule tests.

### Agreed boundaries and coverage

1. **Player and visitor world lifecycle through the browser application.** This is the primary integration boundary. Use browser automation, with Playwright as the proposed tool, to exercise real UI actions, IndexedDB persistence, and the local publication service where relevant. Cover:
   - Starting with an empty island and trees only; catalog locks; each of the ten challenge transitions; proximity masks; the bridge/cloud/second-island reveal order; castle unlock; and continued building after completion.
   - Valid/invalid placement, rotated footprints, boundaries, repeated placement, canceled moves, undo/redo, and camera gestures that do not commit edits.
   - Existing objects satisfying the next challenge and permanent rewards surviving layout deletion or undo.
   - Reload after autosave, supported backup restoration, corrupt/incompatible imports, save failure, and reset with ownership preserved.
   - Publishing a snapshot, making further local edits without changing it, explicitly updating the same link, unpublishing, and safely retrying failed operations.
   - Visitor isolation from the local editable world, absence of editing controls, temporary atmosphere overrides, and direct shared-link navigation/reload.
   - Screenshot download, nonempty rendered image output, and exclusion of UI from the image.
   - Weather/time controls and continued local editing/saving after connection loss.
2. **Public HTTP publication contract against the Worker and a disposable local D1 database.** This additional boundary is justified because hiding owner controls in the browser does not prove server authorization. Verify valid owner updates/deletes; missing/wrong credentials; token/hash absence from public responses; input validation and body limits; creation retry behavior; stable update identifiers; missing/deleted resources; and simulated quota/service failures. Use a Worker-compatible integration harness rather than a mocked database contract.

There is no existing testing prior art in the workspace. Avoid introducing separate test seams for individual visual objects. Add focused lower-level rule tests only if failures or test cost demonstrate that the two public boundaries leave an important behavior insufficiently verified.

### Visual and performance acceptance

- Manually inspect representative daytime, nighttime, rain, snow, both-island, and castle scenes for legibility, natural material and geometry consistency, soft lighting, transition quality, and lack of clipping artifacts.
- Inspect interface clutter and pointer behavior during placement, selection, camera movement, screenshot mode, and visitor mode.
- Test supported desktop browsers with WebGL 2 and the unsupported-capability message. Record the actual browser/hardware matrix used before making compatibility claims.
- Measure frame times, memory behavior, screenshot capture, and interaction responsiveness on representative laptops at normal and reduced detail, including a near-cap world. Establish and document the object cap from results.
- Measure Worker CPU and data/database usage against the selected free-plan constraints. Do not claim free-tier readiness based only on successful local rendering.
- Run a first-use playtest against the ten-minute success criteria in the Solution section, then adjust confusing interactions and challenge quantities without expanding the agreed scope.

## Out of Scope

- Mobile/touch-first controls, native desktop/mobile releases, and installable offline/PWA packaging.
- Accounts, player profiles, account recovery, cloud synchronization of unpublished editable worlds, and a multi-world library.
- Currency, purchases, resource grinding, consumable inventory, timers, survival, or weather damage.
- Terrain sculpting, digging ponds, movable islands, custom bridge construction, additional biomes, and more than two islands.
- Characters, interiors, castle-specific gameplay, imported asset packs, and additional reward variants not in the final ladder.
- Repeatable quests, additional progression after level 10, aesthetic scoring, and timed weather-dependent challenges.
- Public galleries, search/discovery, comments, collaborative editing, multiplayer, and copying/remixing visitor worlds into editable saves.
- Server-side gameplay simulation, physics simulation, live synchronization, server-rendered screenshot generation, and cloud screenshot storage.
- Exact device performance guarantees or an arbitrary object cap before measurement.

## Further Notes

### Proposed delivery order

1. Establish the React/TypeScript app, serializable world model, fixed first island, procedural starter objects, camera, and placement preview.
2. Complete placement/editing, session undo/redo, local saving/restoration, backups, and visible failure handling.
3. Implement the authoritative ten-challenge ladder, full object catalog, bridge reveal, second island, castle, and post-completion decorating.
4. Add weather, day/night, manual controls, transitions, nighttime presentation, and graphics-detail controls.
5. Complete clean PNG capture and the real Worker/D1 publication lifecycle, ownership handling, and isolated visitor routes.
6. Validate the complete loop, authorization, save recovery, browser behavior, visual quality, free-plan usage, and performance; tune quantities and presentation from playtests.

These are implementation milestones, not independent reductions in MVP scope. The MVP is complete only when the entire local building/progression loop and real published-world sharing work together.

### References for verified technical constraints

- [Vite](https://vite.dev/guide/)
- [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Drei camera controls](https://drei.docs.pmnd.rs/controls/camera-controls)
- [Zustand](https://zustand.docs.pmnd.rs/learn/getting-started/introduction)
- [idb](https://github.com/jakearchibald/idb)
- [Browser storage durability and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [Three.js WebGL renderer](https://threejs.org/docs/pages/WebGLRenderer)
- [Cloudflare static SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)
- [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) and [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) and [D1 limits](https://developers.cloudflare.com/d1/platform/limits/)
- [Playwright](https://playwright.dev/docs/intro)

Pricing and quota figures were checked during planning on 15 October 2026 and should be rechecked at deployment.

### Publication handoff

Published to the configured local Markdown tracker with Status: ready-for-agent. The authoritative specification is .scratch/floating-world-builder/spec.md in the D:\FloatingWorldBuilder project. Product scope, core stack, and both testing boundaries are approved.

The matching outputs/floating-world-builder-spec.md is a user-facing export. Future specification changes should update the tracker copy first and refresh the export. The project configuration is recorded in AGENTS.md and docs/agents/. No remote issue tracker or Git repository is required for this local workflow.
