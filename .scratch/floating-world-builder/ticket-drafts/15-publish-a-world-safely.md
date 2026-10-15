# 15: Publish a retry-safe snapshot with anonymous ownership

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** Owners explicitly publish the current world, receive a unique visitor link, and retain private management credentials locally and in backups even if the creation response is interrupted.

**Blocked by:** 04 — Back up, restore, and safely reset a world; 14 — Explore a shared world in an isolated visitor session.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Implement the owner Publish flow and POST /api/worlds through the actual Worker/D1 path; publish a validated public snapshot rather than live editor state.
- [ ] Generate a high-entropy owner token and creation request identity securely, and persist both locally before sending creation. D1 stores only the token hash and idempotency association.
- [ ] Retrying an interrupted creation yields the same publication without duplicate/orphan records; the owner can recover management after restoring a valid private backup.
- [ ] Explain anonymous ownership and recovery limits at first publish; distinguish the public visiting link from the private backup. Tokens never enter public URLs, public responses, or logs.
- [ ] Enforce body/snapshot size below D1 limits, measured object cap, schema/catalog/coordinate/rotation/terrain/reveal validation, and basic anonymous write abuse controls before storing data.
- [ ] After publishing, local edits/autosaves do not change the public snapshot or make publication requests. Show the actual success/error state accurately.
- [ ] Browser tests cover first publication, copied deep link, subsequent local-only edits, credential backup, and interrupted creation retry. Direct Worker/D1 tests cover idempotency, invalid/oversized bodies, private-data absence, and abuse rejection.

**Demo:** Publish, open the link as a visitor, make local changes, and prove the visitor still sees the deliberately published version; retry creation safely.

**Spec coverage:** user stories 38, 45, 47, 49, 50, 51, 53; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
