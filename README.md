# Floating World Builder

Cozy browser world builder. This repository currently contains the project scaffold and a disposable UI exploration, not the implemented MVP.

## Start

Requires Node.js 22.12+ (Node 24 is available on the setup machine).

```powershell
cd D:\FloatingWorldBuilder
npm install
npm run dev
```

The app serves at http://127.0.0.1:5173. The local Worker and D1 binding run with Vite through the official Cloudflare plugin. No Cloudflare login is needed for local development.

## UI exploration

The `prototype/ui-directions` branch contains three in-memory, throwaway builder layouts at `/prototype/builder?variant=A` (also `B` and `C`). Switch with the floating bottom bar or the left/right arrow keys. Form fields keep their normal arrow-key behavior.

```powershell
git switch prototype/ui-directions
npm run prototype
```

No world changes persist. The representative scene and unlocked demo catalog exist only to compare layouts. This is not the MVP's empty-island onboarding. Publishing is a visible demo interaction, not a real upload. The variants and their switcher are excluded from production builds.

`main` holds the scaffold only. Keep the prototype branch as the primary source for the design discussion; promote a selected design only after a verdict.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local app and Worker |
| `npm run prototype` | Open the UI exploration in the default browser |
| `npm run check` | TypeScript validation for app, Vite config, and Worker |
| `npm run build` | Check types and build production client/Worker |
| `npm run preview` | Preview the production build at port 4173 |
| `npm run db:migrate:local` | Apply the publication schema to local D1 |
| `npm run worker:types` | Regenerate Cloudflare binding declarations when needed |

`/api/health` verifies the local Worker and D1 connection. Publication operations deliberately return 501 until implemented. The Wrangler database ID is a local-only placeholder; configure a real database before any future remote deployment. This setup does not deploy anything.

## Structure

- `src/`: React app; `src/prototypes/` contains disposable exploration only on its branch.
- `worker/`: Cloudflare HTTP entry point.
- `migrations/`: D1 schema changes.
- `.scratch/floating-world-builder/spec.md`: authoritative MVP spec.
- `.scratch/floating-world-builder/issues/`: local implementation/design tickets.
- `docs/agents/`: issue, label, and domain conventions.

Dependencies are reproducible through the committed npm lockfile. Runtime data, generated builds, credentials, and local Wrangler state are ignored.
