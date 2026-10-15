# 04: Back up, restore, and safely reset a world

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** Players export a private backup, validate and restore it without damaging their current world, and deliberately reset while retaining any publication management metadata.

**Blocked by:** 02 — Start, build, and restore a first island.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Export the versioned editable world and optional private publication-management information. Explain that backups containing management information must stay private.
- [ ] Validate schema, item identifiers, coordinates, rotations, occupancy, terrain/reveal consistency, and progression consistency before replacement. Apply supported migrations; reject unknown future or malformed schemas safely.
- [ ] Offer confirmation and an export opportunity before import replaces the world or reset clears it. Validation failures leave both the live world and last valid local save intact.
- [ ] Reset clears layout and progression but retains any existing publication credential and management identity. Reset makes no publication request; later publication slices verify this with a real publication.
- [ ] Storage failures keep editing usable, show an accurate unsaved state, and expose a working export escape path. Corrupt saved data receives a recoverable state rather than silent destructive replacement.
- [ ] Exercise export/import round trips, supported-version handling, invalid/future data, canceled replacement/reset, save failures, and preservation of optional management metadata through the browser boundary.

**Demo:** Export a world, reject a bad import without losing it, reset after confirmation, and restore the backup.

**Spec coverage:** user stories 37, 38, 39, 40, 41, 49, 50, 58; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
