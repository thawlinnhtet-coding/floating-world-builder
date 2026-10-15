# 11: Manage publications and recover from outages

Draft revision 2 for breakdown review. Not published to the implementation tracker.

**What to build:** Owners update the same public link, restore management from a private backup, and confirm unpublishing. Owners and visitors receive accurate recovery states while local building remains safe through network, service, and quota failures.

**Blocked by:** 10 — Publish securely with retry-safe ownership.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

### Manage a publication without changing its link

- [ ] Implement explicit owner Update with PUT and confirmed Unpublish with DELETE, verifying bearer-token ownership server-side.
- [ ] Update atomically replaces the validated snapshot at the same public identifier; failure retains the previous snapshot and all local progress.
- [ ] Unpublish removes public access and invalidates management of that deleted publication. A later fresh publish can create a new identifier.
- [ ] Missing/wrong credentials and knowledge of a public identifier cannot update or delete; public API data still contains no secrets or token hashes.
- [ ] Restoring a private backup with valid management metadata restores control; scene-only imports do not prove ownership.
- [ ] Reset keeps management credentials and does not alter/delete the online snapshot. Verify the actual publication remains manageable after reset.
- [ ] Browser tests cover stable-link updates, confirmed/canceled deletion, restored ownership, reset preservation, and unavailable links. Direct Worker/D1 tests cover authorization, atomic failure behavior, validation reuse, and deleted resources.

### Keep local building safe through publication outages

- [ ] After the game is loaded, dropped connectivity does not stop local editing, progression, autosave, backup, or screenshot capture.
- [ ] Handle create/read/update/delete network and service failures without false success, rolled-back local edits, lost ownership, duplicated publications, or accidental snapshot replacement.
- [ ] Distinguish retryable service/rate/quota failure from missing/deleted or incompatible snapshots. Do not imply that a daily reset repairs full database storage.
- [ ] Preserve retry-safe creation and confirmed-management semantics when a response is interrupted or its outcome is initially uncertain.
- [ ] Visitor error/retry flows never open a failed snapshot as an editable world or overwrite the visitor's local slot.
- [ ] Browser integration tests exercise offline and recovered owner/visitor journeys; direct Worker/D1 tests exercise representative rate/service/quota failures without substituting a mocked database contract.

**Demo:** Restore ownership, update the same link, disconnect and continue local building, recover a failed request safely, then unpublish and verify the visitor error state.

**Spec coverage:** user stories 37, 41, 46, 47, 48, 49, 50, 53, 54, 55, 57; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.

**Scope note:** Combines the related journeys from former draft tickets 16 and 17, preserving their acceptance and verification requirements. Implement the acceptance groups consecutively within one ticket; no extra subsystem or general refactor is requested.
