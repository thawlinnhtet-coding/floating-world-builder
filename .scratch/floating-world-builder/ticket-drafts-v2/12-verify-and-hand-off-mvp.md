# 12: Verify and hand off the complete MVP

Draft revision 2 for breakdown review. Not published to the implementation tracker.

**What to build:** A newcomer can set up the project from a clean checkout, complete the local creative loop, and run the real sharing service with documented free-plan deployment configuration.

**Blocked by:** 11 — Manage publications and recover from outages.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Document and verify dependency setup, local run/build, disposable local D1 migration, API/browser checks, and clean production startup with the approved UI.
- [ ] Provide Cloudflare Workers Static Assets/D1 configuration and migration/deployment instructions. Document account/resource prerequisites; do not treat absent credentials as a successful remote deployment or create paid resources.
- [ ] Verify SPA deep links, API routing, schema migrations, and that ordinary static asset requests avoid unnecessary publishing-Worker execution.
- [ ] Measure representative API CPU, payload sizes, and database read/write/storage usage; recheck official Free-plan limits at implementation time and record evidence and practical limits.
- [ ] Run the accumulated browser and direct Worker/D1 suites over all ten challenges, full editing/save/restore, atmosphere, clean screenshots, publication ownership lifecycle, visitor isolation, and failures.
- [ ] Record actual desktop browser/hardware coverage, unsupported-WebGL behavior, normal/reduced graphics, and representative daytime/night/rain/snow/castle visual review.
- [ ] Conduct and record a real first-use playtest against the ten-minute goals: unassisted placement/rearrangement, understanding the next challenge, and voluntary personalization. Keep unobserved criteria open rather than substituting an agent claim.
- [ ] Retain prototype code on its throwaway branch; production contains the approved implementation, with no variant switcher, demo fixtures, fake sharing success, or prototype state inspector. Keep any material remaining defects explicit.

**Demo:** Follow the setup guide on a clean environment, play the full creative loop, publish/update/visit/unpublish using the real local service, and review the recorded release evidence.

**Spec coverage:** user stories 1, 19, 29, 55, 56, 57, 58; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.

**Scope note:** Retains the bounded journey from former draft ticket 18.
