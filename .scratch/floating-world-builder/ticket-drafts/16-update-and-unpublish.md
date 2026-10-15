# 16: Manage a publication without changing its link

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** The rightful owner updates a snapshot at the same link or confirms its removal, including after restoring a backup; public links alone grant no management access.

**Blocked by:** 15 — Publish a retry-safe snapshot with anonymous ownership.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Implement explicit owner Update with PUT and confirmed Unpublish with DELETE, verifying bearer-token ownership server-side.
- [ ] Update atomically replaces the validated snapshot at the same public identifier; failure retains the previous snapshot and all local progress.
- [ ] Unpublish removes public access and invalidates management of that deleted publication. A later fresh publish can create a new identifier.
- [ ] Missing/wrong credentials and knowledge of a public identifier cannot update or delete; public API data still contains no secrets or token hashes.
- [ ] Restoring a private backup with valid management metadata restores control; scene-only imports do not prove ownership.
- [ ] Reset keeps management credentials and does not alter/delete the online snapshot. Verify the actual publication remains manageable after reset.
- [ ] Browser tests cover stable-link updates, confirmed/canceled deletion, restored ownership, reset preservation, and unavailable links. Direct Worker/D1 tests cover authorization, atomic failure behavior, validation reuse, and deleted resources.

**Demo:** Restore an owner backup, update the same visitor link, cancel one deletion, then unpublish and see a clear unavailable-world response.

**Spec coverage:** user stories 41, 46, 48, 49, 50, 53, 54; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
