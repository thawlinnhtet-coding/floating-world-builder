# 03: Rearrange objects with safe editing and undo

Draft for breakdown review. Not published to the implementation tracker.

**What to build:** Players select, move, rotate, and remove placed objects, recover mistakes with undo/redo, and reload to the final committed layout.

**Blocked by:** 02 — Start, build, and restore a first island.

**Status:** needs-info

Proposed status after breakdown approval: ready-for-agent.

- [ ] Selecting an object exposes discoverable move, rotate, and delete actions in the approved interface. Keep placement tools contextual and exploration accessible.
- [ ] Preview moves and quarter-turn rotations against the same buildable masks and rotated footprint occupancy used for placement; never commit invalid edits.
- [ ] Canceling a move keeps the original position. Hover, drag previews, and canceled edits do not change durable state, history, or challenge inputs.
- [ ] Undo/redo covers committed placement, move, rotation, and deletion; a new edit clears the redo branch. Reload keeps layout but clears session history.
- [ ] Route committed editing through one consistent operation boundary so validation, later progression, history, and autosaving observe the same result.
- [ ] Verify real browser edits, cancellation, collision/boundary rejection, camera drag separation, undo/redo branching, and reload. Validate non-square catalog footprints when those models unlock in later slices.

**Demo:** Move and rotate an object, cancel another move, delete/undo/redo, then reload the committed result.

**Spec coverage:** user stories 5, 8, 9, 10, 11, 14, 15, 16; read the full approved MVP specification for shared invariants.

**Design reference:** refined A+C approved by the user on 15 October 2026, captured in prototype commit `90380e3`. Apply the approved layout and natural miniature-world appearance; rebuild production behavior rather than promoting the throwaway demo wholesale.
