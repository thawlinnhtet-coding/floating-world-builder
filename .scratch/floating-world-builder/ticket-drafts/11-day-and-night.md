# 11: Watch day become night and control the time

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** The world cycles between daylight and night, with manual time framing, moonlight, stars, and glowing lamps and cottage windows.

**Blocked by:** 06 — Build a cottage neighborhood through challenges 4–6.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Enable the automatic day/night cycle by default; allow immediate manual time choice and an explicit return to automatic control.
- [ ] Blend daylight, dusk, moonlight, stars, and appropriate emissive lamp/window lighting smoothly while keeping the scene and interface readable.
- [ ] Save selected time/viewing state and automatic/manual settings; frame animation is not written to storage every frame.
- [ ] Time remains cosmetic and never blocks editing or challenge progress. Compose correctly with weather once both slices are present.
- [ ] Browser checks cover automatic progression with a controlled clock, manual overrides, return to automatic, restored settings, and editing at night.
- [ ] Visually review daylight, dusk, night, and combined weather/time scenes at normal camera distance, including the approved compact interface.

**Demo:** Watch the scene reach dusk/night, see the lights glow, frame a manual hour, and resume the cycle.

**Spec coverage:** user stories 33, 34, 35, 36; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
