# 03: Edit safely and recover your world

Draft revision 2 for breakdown review. Not published to the implementation tracker.

**What to build:** Players move, rotate, delete, undo, and redo objects, then protect the resulting world with validated backups, safe restoration/reset, and recoverable storage-failure states.

**Blocked by:** 02 — Start, build, and restore a first island.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

### Rearrange objects with safe editing and undo

- [ ] Selecting an object exposes discoverable move, rotate, and delete actions in the approved interface. Keep placement tools contextual and exploration accessible.
- [ ] Preview moves and quarter-turn rotations against the same buildable masks and rotated footprint occupancy used for placement; never commit invalid edits.
- [ ] Canceling a move keeps the original position. Hover, drag previews, and canceled edits do not change durable state, history, or challenge inputs.
- [ ] Undo/redo covers committed placement, move, rotation, and deletion; a new edit clears the redo branch. Reload keeps layout but clears session history.
- [ ] Route committed editing through one consistent operation boundary so validation, later progression, history, and autosaving observe the same result.
- [ ] Verify real browser edits, cancellation, collision/boundary rejection, camera drag separation, undo/redo branching, and reload. Validate non-square catalog footprints when those models unlock in later slices.

### Back up, restore, and safely reset a world

- [ ] Export the versioned editable world and optional private publication-management information. Explain that backups containing management information must stay private.
- [ ] Validate schema, item identifiers, coordinates, rotations, occupancy, terrain/reveal consistency, and progression consistency before replacement. Apply supported migrations; reject unknown future or malformed schemas safely.
- [ ] Offer confirmation and an export opportunity before import replaces the world or reset clears it. Validation failures leave both the live world and last valid local save intact.
- [ ] Reset clears layout and progression but retains any existing publication credential and management identity. Reset makes no publication request; later publication slices verify this with a real publication.
- [ ] Storage failures keep editing usable, show an accurate unsaved state, and expose a working export escape path. Corrupt saved data receives a recoverable state rather than silent destructive replacement.
- [ ] Exercise export/import round trips, supported-version handling, invalid/future data, canceled replacement/reset, save failures, and preservation of optional management metadata through the browser boundary.

**Demo:** Rearrange a saved world, cancel a move, undo a deletion, export it, reject a malformed import, and safely restore the valid backup.

**Spec coverage:** user stories 5, 8, 9, 10, 11, 14, 15, 16, 37, 38, 39, 40, 41, 49, 50, 58; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved on 15 October 2026, captured in prototype commit `90380e3`. Rebuild production behavior rather than promoting the throwaway fixture wholesale.

**Scope note:** Combines the related journeys from former draft tickets 03 and 04, preserving their acceptance and verification requirements. Implement the acceptance groups consecutively within one ticket; no extra subsystem or general refactor is requested.
