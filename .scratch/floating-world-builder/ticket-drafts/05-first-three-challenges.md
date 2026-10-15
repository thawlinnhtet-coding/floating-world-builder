# 05: Grow the starter garden through challenges 1–3

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** The player plants three trees to unlock rocks, places three rocks to unlock flowers, and places five flowers to unlock the cottage, with permanent saved progression.

**Blocked by:** 03 — Rearrange objects with safe editing and undo.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Implement exactly levels 1–3: 3 trees → rocks; 3 rocks → flowers; 5 flowers → cottage. Add consistent natural models and catalog previews for rocks and flowers.
- [ ] Show active requirement counts and locked reward requirements using the approved compact challenge summary and expanded details.
- [ ] Evaluate progression only on committed layout changes and valid restoration. Immediately re-evaluate existing objects against each newly active challenge, including consecutive already-satisfied steps.
- [ ] Persist completed levels and unlocks separately from reversible layout history. Deletion, movement, and undo never revoke earned rewards.
- [ ] Keep catalog copies unlimited within terrain/occupancy and the later shared measured cap. Add brief, restrained completion and unlock feedback.
- [ ] Browser tests cover every transition, locked-item prevention, pre-existing qualifying objects, permanence after undo/delete, and restoration at each step.

**Demo:** Complete the first three challenges, undo a qualifying placement, reload, and retain the cottage unlock.

**Spec coverage:** user stories 7, 18, 19, 20, 21, 22, 24, 36; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
