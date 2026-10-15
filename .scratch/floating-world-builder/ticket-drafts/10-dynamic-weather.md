# 10: Choose weather or let it change automatically

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** Players enjoy sunny, cloudy, rainy, and snowy atmospheres with smooth transitions, manual choices, and an explicit return to automatic weather.

**Blocked by:** 02 — Start, build, and restore a first island.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Enable automatic weather by default and provide all four manual weather choices plus a visible return-to-automatic control in the atmosphere popover.
- [ ] Blend lighting, cloud/fog appearance, and animated rain/snow particles smoothly; keep frame animation outside durable React/world updates.
- [ ] Save meaningful automatic/manual controls and selected viewing state; reloading restores them predictably.
- [ ] Weather never damages objects, blocks building, changes occupancy, or gates challenge completion.
- [ ] Use deterministic timing/fixtures in browser checks for automatic changes, manual overrides, return to automatic, persistence, and continued editing.
- [ ] Keep effects compatible with the later graphics-detail controls and the separate day/night cycle; verify their combined appearance when both are present.

**Demo:** Switch from sunshine to rain and snow, return to automatic, reload, and continue placing objects.

**Spec coverage:** user stories 30, 31, 32, 35, 36; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
