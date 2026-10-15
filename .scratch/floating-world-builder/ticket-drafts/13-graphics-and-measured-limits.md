# 13: Keep a full world usable on representative laptops

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** Players can reduce shadows and particles, and the completed game enforces an evidence-based object cap consistently instead of failing unpredictably in dense worlds.

**Blocked by:** 09 — Finish challenge 10 and continue free building; 10 — Choose weather or let it change automatically; 11 — Watch day become night and control the time; 12 — Frame and download a clean world screenshot.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Provide understandable shadow/particle detail controls and persist them, retaining the approved visual hierarchy.
- [ ] Measure frame times, memory, interaction, and capture with representative full and dense worlds on documented available laptop hardware at normal/reduced detail.
- [ ] Establish and document a measured object cap; do not invent a performance guarantee or claim an untested hardware matrix.
- [ ] Enforce one shared cap policy for placement and imported worlds, and expose it for publication validation. Reaching it produces clear feedback without removing existing objects.
- [ ] Optimize geometry/material reuse or repeated-object rendering only where measurements identify a need; keep logical saves independent of GPU data.
- [ ] Check dense-world layout edits, imports, detail restoration, and cap feedback through the browser, including rain/snow and night. Record screenshot-mode performance.
- [ ] Inspect both islands, castle, shadows, transitions, labels, and placement for clipping/readability; correct material or geometry inconsistencies within the approved design.

**Demo:** Open a measured dense world, lower detail, inspect the responsiveness, and see consistent cap handling for placement and import.

**Spec coverage:** user stories 17, 56, 57; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
