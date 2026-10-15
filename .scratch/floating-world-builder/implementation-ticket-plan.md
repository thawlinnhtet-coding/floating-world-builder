# Floating World Builder — implementation tickets

Approved and published: 15 October 2026

The 11 approved implementation tickets are published as separate local Markdown issues, numbered 02–12, with ready-for-agent status and explicit blocking dependencies. Ticket 01 is the existing prototype exploration and remains unchanged.

Authoritative tracker: D:\FloatingWorldBuilder\.scratch\floating-world-builder\issues. Linked files below are matching user-facing exports. The source specification is unchanged. The refined A+C design is approved and preserved in prototype commit 90380e3.

02. **[Start, build, and restore a first island](implementation-tickets/02-start-and-save-a-world.md)**
   - **Blocked by:** None (can start immediately).
   - **Delivers:** A new player opens the production game, places trees on one empty island, explores it, and returns after reload to the same locally saved world. Rebuild the approved refined A+C interface for production; the prototype is a visual reference, not the game engine.

03. **[Edit safely and recover your world](implementation-tickets/03-edit-back-up-and-recover.md)**
   - **Blocked by:** 02 — Start, build, and restore a first island.
   - **Delivers:** Players move, rotate, delete, undo, and redo objects, then protect the resulting world with validated backups, safe restoration/reset, and recoverable storage-failure states.

04. **[Build a cottage garden through challenges 1–6](implementation-tickets/04-starter-progression-and-cottage-garden.md)**
   - **Blocked by:** 03 — Edit safely and recover your world.
   - **Delivers:** Players grow from trees-only building into a furnished cottage garden by completing the exact first six challenges, unlocking rocks, flowers, cottages, fences, lamps, and finally the windmill.

05. **[Expand across the bridge through challenges 7–9](implementation-tickets/05-pond-bridge-and-second-island.md)**
   - **Blocked by:** 04 — Build a cottage garden through challenges 1–6.
   - **Delivers:** Players build a windmill and pond garden, reveal the fixed bridge into clouds, decorate its entrance, and unlock a fully editable second island.

06. **[Unlock the castle and continue free building](implementation-tickets/06-castle-and-free-building.md)**
   - **Blocked by:** 05 — Expand across the bridge through challenges 7–9.
   - **Delivers:** Decorating island two unlocks the special castle, completes the guided journey, and leaves the full world available for continued creative play.

07. **[Enjoy dynamic weather and day/night cycles](implementation-tickets/07-weather-and-day-night.md)**
   - **Blocked by:** 04 — Build a cottage garden through challenges 1–6.
   - **Delivers:** Players enjoy all four weather states and a complete day/night cycle, with smooth composed transitions, independent automatic/manual controls, saved viewing state, stars, moonlight, and glowing lamps/windows.

08. **[Capture clean screenshots and tune graphics](implementation-tickets/08-screenshots-graphics-and-measured-cap.md)**
   - **Blocked by:** 06 — Unlock the castle and continue free building; 07 — Enjoy dynamic weather and day/night cycles.
   - **Delivers:** Players compose clean PNG screenshots of the completed world, select shadow/particle detail suitable for their laptop, and receive consistent feedback at a measured object cap.

09. **[Explore shared worlds as a read-only visitor](implementation-tickets/09-read-only-world-visits.md)**
   - **Blocked by:** 08 — Capture clean screenshots and tune graphics.
   - **Delivers:** A direct world link reads a validated D1 snapshot through the Worker and opens a read-only 3D visitor view with temporary atmosphere and screenshot controls.

10. **[Publish securely with retry-safe ownership](implementation-tickets/10-publish-with-anonymous-ownership.md)**
   - **Blocked by:** 09 — Explore shared worlds as a read-only visitor.
   - **Delivers:** Owners explicitly publish the current world, receive a unique visitor link, and retain private management credentials locally and in backups even if the creation response is interrupted.

11. **[Manage publications and recover from outages](implementation-tickets/11-publication-management-and-outages.md)**
   - **Blocked by:** 10 — Publish securely with retry-safe ownership.
   - **Delivers:** Owners update the same public link, restore management from a private backup, and confirm unpublishing. Owners and visitors receive accurate recovery states while local building remains safe through network, service, and quota failures.

12. **[Verify and hand off the complete MVP](implementation-tickets/12-verify-and-hand-off-mvp.md)**
   - **Blocked by:** 11 — Manage publications and recover from outages.
   - **Delivers:** A newcomer can set up the project from a clean checkout, complete the local creative loop, and run the real sharing service with documented free-plan deployment configuration.

## Implementation frontier

Start with 02. Then 03 → 04. After 04, expansion (05 → 06) and atmosphere (07) can proceed independently. Ticket 08 joins 06 and 07; 09 → 10 → 11 → 12 completes sharing, recovery, and handoff. Ready-for-agent describes task readiness; blockers still govern when each can start.

All 58 user stories and all 109 acceptance/verification criteria from the reviewed breakdown are retained. Each slice includes its own validation through the agreed browser and, where relevant, direct Worker/D1 boundaries. The final ticket gathers end-to-end, playtest, performance, and setup/deployment evidence.

No gameplay implementation, remote issue creation, cloud provisioning, or deployment was performed by ticket publication. Earlier draft folders and versioned plans are historical references.
