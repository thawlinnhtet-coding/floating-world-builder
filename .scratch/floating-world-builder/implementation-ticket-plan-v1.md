# Floating World Builder — proposed implementation tickets

Date: 15 October 2026

Draft breakdown for approval; these files are not yet published implementation tickets. Design approval is already recorded separately.

The project scaffold exists. Ticket 01 is the existing prototype exploration and remains unchanged. New implementation tickets continue at 02, in dependency order. Production behavior still needs implementation. No separate prefactoring ticket is justified by the current scaffold.

Each ticket delivers a player/visitor journey and carries its own browser and, where relevant, direct Worker/D1 verification. Final handoff assembles evidence; it does not postpone testing until the end. No remote service is provisioned by this drafting task.

2. **[Start, build, and restore a first island](ticket-drafts/02-start-and-save-a-world.md)**
   - **Blocked by:** None.
   - **Delivers:** A new player opens the production game, places trees on one empty island, explores it, and returns after reload to the same locally saved world. Rebuild the approved refined A+C interface for production; the prototype is a visual reference, not the game engine.

3. **[Rearrange objects with safe editing and undo](ticket-drafts/03-edit-with-undo-and-redo.md)**
   - **Blocked by:** 02.
   - **Delivers:** Players select, move, rotate, and remove placed objects, recover mistakes with undo/redo, and reload to the final committed layout.

4. **[Back up, restore, and safely reset a world](ticket-drafts/04-back-up-and-recover-worlds.md)**
   - **Blocked by:** 02.
   - **Delivers:** Players export a private backup, validate and restore it without damaging their current world, and deliberately reset while retaining any publication management metadata.

5. **[Grow the starter garden through challenges 1–3](ticket-drafts/05-first-three-challenges.md)**
   - **Blocked by:** 03.
   - **Delivers:** The player plants three trees to unlock rocks, places three rocks to unlock flowers, and places five flowers to unlock the cottage, with permanent saved progression.

6. **[Build a cottage neighborhood through challenges 4–6](ticket-drafts/06-cottage-and-lamps.md)**
   - **Blocked by:** 05.
   - **Delivers:** Players build a cottage, arrange fences in its highlighted area, and add street lamps to unlock the windmill.

7. **[Build the windmill and pond garden through challenges 7–8](ticket-drafts/07-pond-garden-and-bridge.md)**
   - **Blocked by:** 06.
   - **Delivers:** A windmill unlocks the pond; a pond with its surrounding flower garden reveals the fixed bridge into a cloud bank.

8. **[Complete the scenic entrance and reveal island two](ticket-drafts/08-reveal-second-island.md)**
   - **Blocked by:** 07.
   - **Delivers:** Players decorate the highlighted bridge entrance with two lamps and five flowers, reveal the second island, and build on it with the existing tools.

9. **[Finish challenge 10 and continue free building](ticket-drafts/09-castle-and-free-building.md)**
   - **Blocked by:** 08.
   - **Delivers:** Decorating island two unlocks the special castle, completes the guided journey, and leaves the full world available for continued creative play.

10. **[Choose weather or let it change automatically](ticket-drafts/10-dynamic-weather.md)**
   - **Blocked by:** 02.
   - **Delivers:** Players enjoy sunny, cloudy, rainy, and snowy atmospheres with smooth transitions, manual choices, and an explicit return to automatic weather.

11. **[Watch day become night and control the time](ticket-drafts/11-day-and-night.md)**
   - **Blocked by:** 06.
   - **Delivers:** The world cycles between daylight and night, with manual time framing, moonlight, stars, and glowing lamps and cottage windows.

12. **[Frame and download a clean world screenshot](ticket-drafts/12-capture-clean-screenshots.md)**
   - **Blocked by:** 02.
   - **Delivers:** Players hide the interface, compose with the camera, and download a complete PNG of their world without publishing it.

13. **[Keep a full world usable on representative laptops](ticket-drafts/13-graphics-and-measured-limits.md)**
   - **Blocked by:** 09, 10, 11, 12.
   - **Delivers:** Players can reduce shadows and particles, and the completed game enforces an evidence-based object cap consistently instead of failing unpredictably in dense worlds.

14. **[Explore a shared world in an isolated visitor session](ticket-drafts/14-explore-published-worlds.md)**
   - **Blocked by:** 13.
   - **Delivers:** A direct world link reads a validated D1 snapshot through the Worker and opens a read-only 3D visitor view with temporary atmosphere and screenshot controls.

15. **[Publish a retry-safe snapshot with anonymous ownership](ticket-drafts/15-publish-a-world-safely.md)**
   - **Blocked by:** 04, 14.
   - **Delivers:** Owners explicitly publish the current world, receive a unique visitor link, and retain private management credentials locally and in backups even if the creation response is interrupted.

16. **[Manage a publication without changing its link](ticket-drafts/16-update-and-unpublish.md)**
   - **Blocked by:** 15.
   - **Delivers:** The rightful owner updates a snapshot at the same link or confirms its removal, including after restoring a backup; public links alone grant no management access.

17. **[Keep local building safe through publication outages](ticket-drafts/17-survive-network-and-service-failures.md)**
   - **Blocked by:** 16.
   - **Delivers:** Network loss, service errors, and quota failures leave local editing/saving intact and give owners and visitors accurate retry and recovery states.

18. **[Run and hand off the complete shareable MVP](ticket-drafts/18-verify-and-hand-off-mvp.md)**
   - **Blocked by:** 17.
   - **Delivers:** A newcomer can set up the project from a clean checkout, complete the local creative loop, and run the real sharing service with documented free-plan deployment configuration.

## Frontier and dependency notes

- Start with 02. After it is complete, 03, 04, 10, and 12 can start independently.
- Progression follows 05 → 06 → 07 → 08 → 09. Day/night needs the actual lamp assets from 06, while weather and screenshot work need only the first saved-world slice.
- 13 needs the completed local scene/effects/capture to establish one measured cap and detail policy. 14 consumes that validated rendering contract for visitors. These gates prevent shipping a public viewer with unknown catalog/reveal/cap behavior.
- 15 needs both the isolated visitor path (14) and the private-backup lifecycle (04). 16 and 17 then complete management and interruption recovery.
- 18 depends on the completed failure-resilient loop. Human first-use observations and any account prerequisites are recorded honestly; remote deployment is not assumed.

## Coverage audit

All 58 user stories are mapped to at least one ticket. The detailed acceptance criteria allocate the exact ten-challenge ladder, permanent unlocks, editing/save rules, both approved test boundaries, publication ownership/idempotency, visitor isolation, and performance/deployment evidence.

## Review requested

Review ticket size, whether each blocker genuinely gates its ticket, and whether any slices should merge or split. After approval, publish one file per ticket to the configured local tracker with ready-for-agent status. Do not close or modify the source specification or existing parent issue as part of ticket publication.
