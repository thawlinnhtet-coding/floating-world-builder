# 07: Enjoy dynamic weather and day/night cycles

Draft revision 2 for breakdown review. Not published to the implementation tracker.

**What to build:** Players enjoy all four weather states and a complete day/night cycle, with smooth composed transitions, independent automatic/manual controls, saved viewing state, stars, moonlight, and glowing lamps/windows.

**Blocked by:** 04 — Build a cottage garden through challenges 1–6.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

### Choose weather or let it change automatically

- [ ] Enable automatic weather by default and provide all four manual weather choices plus a visible return-to-automatic control in the atmosphere popover.
- [ ] Blend lighting, cloud/fog appearance, and animated rain/snow particles smoothly; keep frame animation outside durable React/world updates.
- [ ] Save meaningful automatic/manual controls and selected viewing state; reloading restores them predictably.
- [ ] Weather never damages objects, blocks building, changes occupancy, or gates challenge completion.
- [ ] Use deterministic timing/fixtures in browser checks for automatic changes, manual overrides, return to automatic, persistence, and continued editing.
- [ ] Compose weather and time in this ticket with independently controllable automatic/manual modes; verify their combined appearance. Keep effects compatible with the later graphics-detail controls.

### Watch day become night and control the time

- [ ] Enable the automatic day/night cycle by default; allow immediate manual time choice and an explicit return to automatic control.
- [ ] Blend daylight, dusk, moonlight, stars, and appropriate emissive lamp/window lighting smoothly while keeping the scene and interface readable.
- [ ] Save selected time/viewing state and automatic/manual settings; frame animation is not written to storage every frame.
- [ ] Time remains cosmetic and never blocks editing or challenge progress. Verify composed weather/time transitions in this ticket.
- [ ] Browser checks cover automatic progression with a controlled clock, manual overrides, return to automatic, restored settings, and editing at night.
- [ ] Visually review daylight, dusk, night, and combined weather/time scenes at normal camera distance, including the approved compact interface.

**Demo:** Choose rain and a night view, see lights and particles, return both controls to automatic, reload, and keep building without gameplay penalties.

**Spec coverage:** user stories 30, 31, 32, 33, 34, 35, 36; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.

**Scope note:** Combines the related journeys from former draft tickets 10 and 11, preserving their acceptance and verification requirements. Implement the acceptance groups consecutively within one ticket; no extra subsystem or general refactor is requested.
