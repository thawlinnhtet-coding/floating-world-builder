# 08: Capture clean screenshots and tune graphics

Breakdown approved on 15 October 2026.

**What to build:** Players compose clean PNG screenshots of the completed world, select shadow/particle detail suitable for their laptop, and receive consistent feedback at a measured object cap.

**Blocked by:** 06 — Unlock the castle and continue free building; 07 — Enjoy dynamic weather and day/night cycles.

**Status:** ready-for-agent

**Execution:** implemented and locally verified

### Frame and download a clean world screenshot

- [x] Enter screenshot mode from a discoverable control, hide normal game/review UI, and keep camera rotation, pan, and zoom available.
- [x] Expose capture and exit actions, but exclude both actions and all interface elements from the downloaded image.
- [x] Capture the current camera, atmosphere, models, and visible effects as a nonempty complete PNG; work entirely in the browser without uploading media.
- [x] Exit returns to the prior world and editing state without layout changes or publication requests.
- [x] Avoid a permanent rendering configuration that unnecessarily harms normal play; measure capture behavior with the completed scene in this ticket's graphics checks.
- [x] Browser tests verify a PNG download, nonempty scene pixels, UI exclusion, camera composition, and safe return to editing. Reuse this behavior in visitor mode later.

### Keep a full world usable on representative laptops

- [x] Provide understandable shadow/particle detail controls and persist them, retaining the approved visual hierarchy.
- [x] Measure frame times, memory, interaction, and capture with representative full and dense worlds on documented available laptop hardware at normal/reduced detail.
- [x] Establish and document a measured object cap; do not invent a performance guarantee or claim an untested hardware matrix.
- [x] Enforce one shared cap policy for placement and imported worlds, and expose it for publication validation. Reaching it produces clear feedback without removing existing objects.
- [x] Optimize geometry/material reuse or repeated-object rendering only where measurements identify a need; keep logical saves independent of GPU data.
- [x] Check dense-world layout edits, imports, detail restoration, and cap feedback through the browser, including rain/snow and night. Record screenshot-mode performance.
- [x] Inspect both islands, castle, shadows, transitions, labels, and placement for clipping/readability; correct material or geometry inconsistencies within the approved design.

**Demo:** Frame a dense rainy/nighttime world, lower detail, capture a complete UI-free PNG, and verify consistent cap handling for placement and imports.

**Spec coverage:** user stories 17, 42, 43, 44, 56, 57; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.


## Implementation evidence — 15 October 2026

Full and dense frame/heap/capture evidence, shared 80-object cap, PNG pixel verification and detail restoration: graphics.spec.ts, journey.spec.ts, recovery.spec.ts. See `docs/implementation-evidence.md` for exact test runs, measurements, limitations, and the user feedback fixes. These completion marks refer to local implementation and available-hardware verification; they do not assert a remote deployment or an unobserved human playtest.
