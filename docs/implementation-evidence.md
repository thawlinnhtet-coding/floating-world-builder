# Floating World Builder implementation evidence

Recorded 15 October 2026. Project: `D:\FloatingWorldBuilder`, branch `implementation/mvp`.

## Delivered behavior

Tickets 02–11 are implemented and locally verified. Ticket 12's implementation, setup guide, production build, local service smoke test, and automated checks are complete; deployed CPU/database quota evidence and the complete human first-use playtest remain open.

The production app starts empty, offers grid placement and safe editing, progresses through all ten approved challenges, unlocks the fixed bridge and second island, and supports castle placement and continued building. It includes local autosaves, private backups, undo/redo, graphics settings, four weather states, day/night cycles, clean PNG capture, and a real Worker/D1 publication lifecycle. Visitors have an isolated read-only view. The prototype remains on `prototype/ui-directions` at `90380e3`.

## Feedback addressed

The user's first-use feedback was: “where is delete button?” and weather selections appeared unchanged. Explore is now visibly **Select & edit**. Clicking an object exposes labeled **Move**, **Rotate**, and **Delete** controls. Delete/Backspace removes a selected object outside text fields, screenshot mode, and confirmation dialogs; Undo restores it.

Rain now uses visible angled streaks. Snow uses soft flakes sized correctly for an orthographic camera—the original subpixel size was the cause of invisible snow. Weather changes the sky, cloud density/color, and lighting; the header identifies the current weather. Trees and flowers sway, clouds drift, windmill speed follows the wind, pond ripples expand, placement has a small settling motion, and selection/reward messages animate. Animation stays outside saved frame state. Background tabs reduce rendering activity.

This feedback is recorded as a playtest finding and fix, **not a completed ten-minute acceptance playtest**. Unassisted rearrangement, next-challenge comprehension, and voluntary personalization still need observation after these changes.

## Checks and exact scope

- `npm run build`: passed TypeScript and production client/Worker builds. The client is about 1.25 MB before compression, 347 KB gzip. Vite reports the expected large chunk warning for the immediately needed 3D runtime.
- Full accumulated run: **25 passed**. This includes four real Worker/D1 HTTP tests and browser editing, progression, persistence, backup, visitor, screenshot, failure, and performance checks.
- Final affected feedback suite: **3 passed** after the final keyboard/atmosphere continuity changes.
- Final photo-mode regression: **1 passed** after excluding grid/selection/placement guides, blocking mouse and keyboard edits during capture, and preserving the previous tool/selection on exit.
- Added castle/day/dusk/night visual suite: **1 passed**, with no uncaught browser errors. The initial visual test clicked an empty cell; its fixture selection was corrected and the test passed.
- The continuous ten-challenge journey passed again after adding full-world measurements. It uses normal player actions from an empty world, reaches 40 objects, then reloads with the castle unlocked.
- There are **26 distinct passing tests** across the combined runs. They were not all rerun as one 26-test command after adding the visual evidence test.
- A fresh disposable directory successfully ran `npm ci`, `npm run build`, and both local migrations. The compiled Worker served the client, a direct visiting route, and API requests. A separate release smoke check passed creation, retry idempotency, read, update, unpublish, and missing-after-delete behavior.

Tests use port 5175 and a separate `.wrangler/test-state` database. The service-fault test renames a table only in that disposable database and restores it in `finally`. The compiled release smoke used a separate clean-directory database and removed its synthetic publication. Normal local player saves and publications were not reset.

## Graphics measurements and cap

Available hardware: MSI Thin GF63 12VE, Intel i7-12650H, about 15.7 GiB RAM. The machine also has an RTX 4050, but **the measured browser used Intel UHD via ANGLE/D3D11**. Browser: headless Google Chrome 155 on Windows, viewport 1440×960. Firefox, Safari, Edge, and other hardware were not tested. Unsupported WebGL 2 was verified through simulated capability failure, not a second physical machine.

The complete 40-object journey measured **16.7 ms median / 16.8 ms p95** frame intervals, with approximately 147.6 MiB JavaScript heap.

| Dense scenario | Median interval | p95 interval | JS heap |
|---|---:|---:|---:|
| 80 trees, daytime / normal | 33.7 ms | 66.7 ms | 135.0 MiB |
| 80 trees, daytime / reduced | 33.3 ms | 50.5 ms | 128.0 MiB |
| 80 trees, rainy night | 50.0 ms | 66.7 ms | 126.4 MiB |
| 80 trees, snow | 49.9 ms | 66.6 ms | 136.6 MiB |
| 80 trees, snow / screenshot mode | 49.9 ms | 66.8 ms | 139.7 MiB |

The shared cap is **80 objects across both islands**, enforced by placement, import, and publication validation. It replaces the provisional unmeasured 240 limit. Eighty trees provide a demanding dense scene; the limit is a measured policy, not a 60 FPS guarantee. Dense weather scenes can fall to roughly 20–30 FPS on the measured integrated GPU, with occasional slower frames. Reduced detail improves the daytime tail but cannot eliminate every bottleneck. Further device tuning remains possible.

The measurements justified instancing tree branches and flower parts, avoiding shadow reception on individual leaves, reducing shadow sample/map cost, and limiting pixel density. Different local sessions varied substantially; these numbers include browser scheduling and competing desktop activity. Heap readings exclude GPU allocations and are not a leak/stability proof. The dense capture took about 2.44 seconds including automation/download, produced a nonempty UI-free PNG, and does not rely on permanent `preserveDrawingBuffer`.

Raw evidence: `outputs/graphics-measurement.json`, `outputs/journey-measurement.json`. Representative day, dusk, night, rain, snow, castle, editing, dense, and clean-capture PNGs are generated locally by the browser suites; PNGs are excluded from Git.

## Publishing, size, and deployment evidence

The compiled release smoke measured a 7,974-byte creation request, 8,041-byte public response, and 7,918-byte stored snapshot for an 80-object sample. These are observations, not maxima; the enforced request cap is 192,000 bytes. The service validates versions, catalog, footprints, reveal consistency, object cap, and public fields before storage.

Successful reads use one indexed publication query. Authorized creation/update/deletion normally uses four SQL statements: write-rate bucket increment, expired-bucket cleanup, then publication write/read or ownership read/write. Actual billed rows depend on indexes and expiry cleanup. Local D1 only returned a zero-duration aggregate-query metadata field; it did not supply deployed row-billing or CPU evidence. `outputs/release-smoke.json` records local HTTP timing and payload observations. Local round-trip time is **not Worker CPU time**.

The generated production configuration routes `/api/*` through the Worker and uses Static Assets SPA fallback for client routes. All-zero D1 identification is local-only. README documents account sign-in, database creation, binding replacement, remote migrations, deployment, and post-deployment verification. No remote resources were created and no public internet deployment was claimed. Localhost visiting links work on this machine.

Official limits were rechecked on 15 October 2026: Workers Free 100,000 dynamic requests/day and 10 ms CPU/invocation; D1 Free 500 MB/database and 2 MB row/string. See the official links in README. These limits are context for deployment, **not proof that deployed API CPU or database usage fits them**.

## Remaining acceptance work

1. Configure the owner's Cloudflare account and real D1 resource, deploy, then measure CPU and D1 read/write/storage usage and verify remote deep links/ownership/error outcomes.
2. Repeat the real first-use playtest after the Delete/weather changes and record unassisted placement/rearrangement, challenge understanding, and voluntary personalization within ten minutes.
3. Broader browser/hardware coverage and sustained dense-scene memory/performance testing remain outside the observations recorded here; avoid compatibility or frame-rate guarantees.

Run the game with `npm run dev` and open http://127.0.0.1:5173/. The README contains backup/ownership guidance and reproduction commands.
