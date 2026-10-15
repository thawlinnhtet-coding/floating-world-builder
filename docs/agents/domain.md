# Domain docs

## Layout

This project uses a single context: one root `GLOSSARY.md` and root `docs/adr/` for architecture decision records.

## Before exploring or changing the codebase

1. Read the root `GLOSSARY.md` when present.
2. Read ADRs in `docs/adr/` that relate to the work.
3. If a root `GLOSSARY-MAP.md` is introduced later, follow it to the relevant context glossaries and check their context-scoped ADRs as well.

When these documents are absent, proceed silently. Create domain documentation lazily through the domain-modeling workflow when actual terminology or decisions need recording; setup does not create empty glossaries or ADRs.

## Vocabulary

Use the glossary's terms consistently in specifications, issue titles, reviews, and implementation discussion. When a needed concept has no definition, first check whether an existing term covers it; note a real gap for domain modeling rather than inventing competing terminology.

## Architecture decisions

When proposed work conflicts with an existing ADR, identify the ADR and explain the conflict and why the decision may need revisiting.
