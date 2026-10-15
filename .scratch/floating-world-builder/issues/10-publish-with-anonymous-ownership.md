# 10: Publish securely with retry-safe ownership

Breakdown approved on 15 October 2026.

**What to build:** Owners explicitly publish the current world, receive a unique visitor link, and retain private management credentials locally and in backups even if the creation response is interrupted.

**Blocked by:** 09 — Explore shared worlds as a read-only visitor.

**Status:** ready-for-agent

**Execution:** implemented and locally verified

- [x] Implement the owner Publish flow and POST /api/worlds through the actual Worker/D1 path; publish a validated public snapshot rather than live editor state.
- [x] Generate a high-entropy owner token and creation request identity securely, and persist both locally before sending creation. D1 stores only the token hash and idempotency association.
- [x] Retrying an interrupted creation yields the same publication without duplicate/orphan records; the owner can recover management after restoring a valid private backup.
- [x] Explain anonymous ownership and recovery limits at first publish; distinguish the public visiting link from the private backup. Tokens never enter public URLs, public responses, or logs.
- [x] Enforce body/snapshot size below D1 limits, measured object cap, schema/catalog/coordinate/rotation/terrain/reveal validation, and basic anonymous write abuse controls before storing data.
- [x] After publishing, local edits/autosaves do not change the public snapshot or make publication requests. Show the actual success/error state accurately.
- [x] Browser tests cover first publication, copied deep link, subsequent local-only edits, credential backup, and interrupted creation retry. Direct Worker/D1 tests cover idempotency, invalid/oversized bodies, private-data absence, and abuse rejection.

**Demo:** Publish, open the link as a visitor, make local changes, and prove the visitor still sees the deliberately published version; retry creation safely.

**Spec coverage:** user stories 38, 45, 47, 49, 50, 51, 53; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.


## Implementation evidence — 15 October 2026

Real creation, ownership hashing, validation, throttling, safe retry and private backup: api.spec.ts and game.spec.ts. See `docs/implementation-evidence.md` for exact test runs, measurements, limitations, and the user feedback fixes. These completion marks refer to local implementation and available-hardware verification; they do not assert a remote deployment or an unobserved human playtest.
