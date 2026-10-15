# 12: Frame and download a clean world screenshot

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** Players hide the interface, compose with the camera, and download a complete PNG of their world without publishing it.

**Blocked by:** 02 — Start, build, and restore a first island.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Enter screenshot mode from a discoverable control, hide normal game/review UI, and keep camera rotation, pan, and zoom available.
- [ ] Expose capture and exit actions, but exclude both actions and all interface elements from the downloaded image.
- [ ] Capture the current camera, atmosphere, models, and visible effects as a nonempty complete PNG; work entirely in the browser without uploading media.
- [ ] Exit returns to the prior world and editing state without layout changes or publication requests.
- [ ] Avoid a permanent rendering configuration that unnecessarily harms normal play; measure capture behavior again with the completed scene in the graphics slice.
- [ ] Browser tests verify a PNG download, nonempty scene pixels, UI exclusion, camera composition, and safe return to editing. Reuse this behavior in visitor mode later.

**Demo:** Frame a close-up, download it with no controls in the image, and return to the unchanged world.

**Spec coverage:** user stories 42, 43, 44; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
