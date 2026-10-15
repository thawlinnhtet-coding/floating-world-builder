# 08: Capture clean screenshots and tune graphics

Draft revision 2 for breakdown review. Not published to the implementation tracker.

**What to build:** Players compose clean PNG screenshots of the completed world, select shadow/particle detail suitable for their laptop, and receive consistent feedback at a measured object cap.

**Blocked by:** 06 — Unlock the castle and continue free building; 07 — Enjoy dynamic weather and day/night cycles.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

### Frame and download a clean world screenshot

- [ ] Enter screenshot mode from a discoverable control, hide normal game/review UI, and keep camera rotation, pan, and zoom available.
- [ ] Expose capture and exit actions, but exclude both actions and all interface elements from the downloaded image.
- [ ] Capture the current camera, atmosphere, models, and visible effects as a nonempty complete PNG; work entirely in the browser without uploading media.
- [ ] Exit returns to the prior world and editing state without layout changes or publication requests.
- [ ] Avoid a permanent rendering configuration that unnecessarily harms normal play; measure capture behavior with the completed scene in this ticket's graphics checks.
- [ ] Browser tests verify a PNG download, nonempty scene pixels, UI exclusion, camera composition, and safe return to editing. Reuse this behavior in visitor mode later.

### Keep a full world usable on representative laptops

- [ ] Provide understandable shadow/particle detail controls and persist them, retaining the approved visual hierarchy.
- [ ] Measure frame times, memory, interaction, and capture with representative full and dense worlds on documented available laptop hardware at normal/reduced detail.
- [ ] Establish and document a measured object cap; do not invent a performance guarantee or claim an untested hardware matrix.
- [ ] Enforce one shared cap policy for placement and imported worlds, and expose it for publication validation. Reaching it produces clear feedback without removing existing objects.
- [ ] Optimize geometry/material reuse or repeated-object rendering only where measurements identify a need; keep logical saves independent of GPU data.
- [ ] Check dense-world layout edits, imports, detail restoration, and cap feedback through the browser, including rain/snow and night. Record screenshot-mode performance.
- [ ] Inspect both islands, castle, shadows, transitions, labels, and placement for clipping/readability; correct material or geometry inconsistencies within the approved design.

**Demo:** Frame a dense rainy/nighttime world, lower detail, capture a complete UI-free PNG, and verify consistent cap handling for placement and imports.

**Spec coverage:** user stories 17, 42, 43, 44, 56, 57; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.

**Scope note:** Combines the related journeys from former draft tickets 12 and 13, preserving their acceptance and verification requirements. Implement the acceptance groups consecutively within one ticket; no extra subsystem or general refactor is requested.
