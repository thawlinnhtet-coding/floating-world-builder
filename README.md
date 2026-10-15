# Floating World Builder

A cozy desktop-browser world builder using the approved refined A+C interface. Start with an empty floating island, complete ten challenges, unlock a second island and a castle, and keep decorating. The production app uses React/TypeScript, React Three Fiber, Zustand, IndexedDB, and a Cloudflare Worker/D1 publication service.

## Local setup

Requires Node.js 22.12+ and npm. From this project directory:

```powershell
npm ci
npm run db:migrate:local
npm run dev
```

Open http://127.0.0.1:5173/. Local editing and saving do not need a Cloudflare account. Publishing in local development creates real records in the local D1 database; the resulting localhost links are only accessible on this machine.

Use the build dock to choose unlocked items and click grass to place them. Drag to orbit, right-drag to pan, and scroll to zoom. Choose **Select & edit**, then click an object to reveal labeled **Move**, **Rotate**, and **Delete** actions. Delete/Backspace also removes a selected object; Undo brings it back. Escape cancels a move or returns to Select & edit. Gold cells show qualifying cottage, pond, or bridge entrance areas. Completed challenges and unlocks survive undo or deletion.

## Saves and ownership

One editable world is saved in IndexedDB. The settings panel offers private backup export, validated import, graphics controls, and confirmed reset. Session undo history is not persisted. Version 1 is supported; unknown versions and malformed/colliding layouts are rejected without replacing the current save. A future schema release must add an explicit migration before accepting an older incompatible format.

Export backups regularly. A backup can include the private publication credential; keep it private. Losing both browser data and that backup loses update/unpublish access. The public visiting link never recovers ownership. Reset retains publication management information and does not change the online snapshot. Import replaces ownership with the information in the imported backup.

## Sharing

Share explicitly publishes a snapshot. Editing/autosaving remains local until Update is chosen. The same public identifier survives updates. Unpublish removes the public view. Creation credentials and request identity are persisted before network creation; retrying an interrupted creation recovers the same publication. Owner tokens are hashed in D1 and never included in visiting URLs or public responses.

Visitors open `/world/{publicId}` in an isolated read-only session. Camera, temporary atmosphere changes, and screenshots are available; editing, owner actions, and writes to the visitor's editable slot are disabled.

The API caps request bodies at 192,000 bytes and accepts only supported world data. A shared **80-object** cap applies to placement/import/publication, based on the documented dense-scene measurements. Both islands share this cap. Anonymous writes are throttled to 30 attempts per ten-minute IP bucket; failed attempts also count. This is basic abuse protection, not unlimited-traffic hosting. Local building continues when publishing is unavailable.

## Verification

```powershell
npm run check
npm run build
npm test
```

Browser tests use installed Google Chrome. Tests start their own server on port 5175 and use `.wrangler/test-state`, separate from normal local D1. The service-fault test temporarily renames a table only in that isolated database and restores it in a finally block. Browser profiles and IndexedDB are isolated per test. Do not point that harness at production resources.

Focused commands: `npm run test:browser`, `npm run test:api`; individual suites can be run with `npm test -- tests/journey.spec.ts` or `npm test -- tests/graphics.spec.ts`.

The suite verifies public player/visitor behavior and real Worker/D1 contracts. Subjective first-use enjoyment, actual target-browser/hardware coverage, and deployed Worker CPU/quota usage need their own recorded evidence; automated success is not a substitute for those observations.

## Cloudflare deployment

No paid assets or services are required by the app. A Cloudflare account and a real D1 database are required to make public links accessible beyond this machine. The all-zero database identifier is intentionally local-only.

1. Sign in with `npx wrangler login` using your own account.
2. Create a D1 database with `npx wrangler d1 create floating-worlds`.
3. Put its returned database identifier in the `DB` binding in `wrangler.jsonc`; preserve the binding name, migrations directory, and assets routing.
4. Apply schema remotely with `npx wrangler d1 migrations apply floating-worlds --remote`.
5. Run the checks and `npm run deploy`. The generated Worker configuration serves built client assets and routes `/api/*` through the publication Worker.
6. Verify a direct visiting-link reload, publish/update/delete authorization, and Worker invocation CPU/database usage on the deployed URL. Use HTTPS. Do not call local round-trip time a deployed CPU measurement.

The project targets Workers Free and D1 Free. Static asset requests remain outside the publishing Worker except `/api/*`. Official limits rechecked on 15 October 2026: Workers Free has 100,000 dynamic requests/day and 10 ms CPU/invocation; D1 Free has a 500 MB per-database maximum and a 2 MB row/string limit. Request/data limits here are intentionally lower. Rate-limit metadata also consumes database operations. Quota exhaustion and full storage may interrupt sharing; local building remains available after the page has loaded. The app does not include offline installation/PWA packaging.

Sources: [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/), [Static Assets billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/). No remote resources were created or deployed during local implementation.

Detailed local evidence, performance limits, and remaining external checks are recorded in [implementation evidence](docs/implementation-evidence.md).

## Design and work tracking

The approved prototype remains archived on `prototype/ui-directions` at commit `90380e3`. Production behavior lives on `implementation/mvp`; no prototype route, demo fixture, review switcher, or fake Share implementation is shipped. Tickets 02–12 and implementation evidence are tracked in local Markdown under `.scratch/floating-world-builder`.
