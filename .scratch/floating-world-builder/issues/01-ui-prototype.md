# Explore builder UI directions

Status: needs-info
Type: prototype

## Question

Which interface best balances an uncluttered floating world with discoverable building, challenge, and atmosphere controls?

## Scope

Build three structurally different layouts around one representative interactive 3D scene: A, a floating builder dock; B, a journal sidebar; C, a minimal contextual studio. Use one development-only route with a query-parameter switcher, in-memory state, and a visible state inspector. No production gameplay, persistence, or real publishing is part of this ticket.

## Primary source

- Throwaway branch: `prototype/ui-directions`.
- Prototype route: `/prototype/builder?variant=A`, also `B` and `C`.
- Entry point: `src/prototypes/builder/BuilderPrototype.tsx` on that branch.
- Main retains the scaffold; prototype promotion follows a user verdict.

## Verdict

Pending user comparison. No layout has been selected or promoted.

## Comments

The project scaffold is established first, as requested. The complete MVP specification remains ready-for-agent; this exploration resolves interface direction before gameplay implementation.
