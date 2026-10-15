# Issue tracker: Local Markdown

Issues and specs for this project live as Markdown files under `.scratch/`.

## Conventions

- Use one directory per feature: `.scratch/<feature-slug>/`.
- Store the feature specification at `.scratch/<feature-slug>/spec.md`.
- Store each implementation ticket separately at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`.
- Record triage state with a `Status:` line near the top of each spec or ticket. Use the role strings in `triage-labels.md`.
- Append comments and conversation history under a `## Comments` heading.
- The tracker copy is authoritative. Files under `outputs/` are user-facing exports, not a separate issue tracker.

## Publish to the issue tracker

For a specification, create or update `.scratch/<feature-slug>/spec.md`. For implementation tickets, create one numbered file per ticket under that feature's `issues/` directory. Create the containing directories as needed.

Apply a requested triage label by setting the `Status:` line. For example, a spec ready for implementation uses `Status: ready-for-agent`.

## Fetch a ticket

Read the supplied spec or ticket path. If only a ticket number is supplied, resolve it within the named feature's `issues/` directory. If the feature is ambiguous, identify the intended feature before editing a ticket.

## Wayfinding operations

When a wayfinding workflow is invoked:

- Store the map at `.scratch/<effort>/map.md`, with Notes, Decisions-so-far, and Fog sections.
- Store one child ticket per question at `.scratch/<effort>/issues/NN-<slug>.md`.
- Use a `Type:` line for `research`, `prototype`, `grilling`, or `task`.
- Use `Status: open`, `Status: claimed`, or `Status: resolved` for the child workflow. These execution states are separate from the five triage roles.
- Record dependencies as `Blocked by: NN, NN`. A child is unblocked when all listed children are resolved.
- Select the lowest-numbered open, unblocked, unclaimed child.
- Claim the child before working. Resolve it by appending an `## Answer` section and adding an answer summary and pointer to Decisions-so-far in the map.
