# 17: Keep local building safe through publication outages

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** Network loss, service errors, and quota failures leave local editing/saving intact and give owners and visitors accurate retry and recovery states.

**Blocked by:** 16 — Manage a publication without changing its link.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] After the game is loaded, dropped connectivity does not stop local editing, progression, autosave, backup, or screenshot capture.
- [ ] Handle create/read/update/delete network and service failures without false success, rolled-back local edits, lost ownership, duplicated publications, or accidental snapshot replacement.
- [ ] Distinguish retryable service/rate/quota failure from missing/deleted or incompatible snapshots. Do not imply that a daily reset repairs full database storage.
- [ ] Preserve retry-safe creation and confirmed-management semantics when a response is interrupted or its outcome is initially uncertain.
- [ ] Visitor error/retry flows never open a failed snapshot as an editable world or overwrite the visitor's local slot.
- [ ] Browser integration tests exercise offline and recovered owner/visitor journeys; direct Worker/D1 tests exercise representative rate/service/quota failures without substituting a mocked database contract.

**Demo:** Disconnect after loading, continue building and saving, trigger a failed update, reconnect, retry, and confirm local and published states stay correct.

**Spec coverage:** user stories 37, 47, 54, 55, 57; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
