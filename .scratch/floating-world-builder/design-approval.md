# Floating World Builder — approved design

Date: 15 October 2026

The user explicitly approved the refined A+C design before requesting implementation tickets.

## Approved direction

- One persistent bottom build dock with neutral tiles, previews rendered from actual 3D objects, complete-card paging on narrower windows, and contextual editing tools in the same dock.
- A compact expandable challenge summary, grouped world identity and atmosphere/sharing controls, and minimal redundant labels or item badges.
- Natural miniature-world scenery with rich greens, leafy trees, textured grass and rock, terracotta roofs, detailed cottages, reflective pond water, atmospheric clouds, and soft lighting.
- Keep the editable scene central and the interface readable at desktop/laptop sizes.

## Reference

The accepted prototype is preserved on branch `prototype/ui-directions`, commit `90380e3`, with route `/prototype/builder?variant=A`.

The reference image is `ui-ac-refined.png`; the narrower-window review is `ui-ac-refined-laptop.png` in the chat outputs. The prototype is an approved visual reference. Its in-memory fixture, approximate placement rules, fake publishing, and review controls are not approved production behavior.

## Implementation scope

Implement the full existing MVP specification, including the exact ten challenges, robust local persistence, real publication ownership, isolated visitor exploration, and both agreed testing boundaries. No product-scope expansion or deadline is introduced by this design approval.

The user separately approved the consolidated 11-ticket implementation breakdown on 15 October 2026. Tickets 02–12 are published to the local Markdown tracker with ready-for-agent status and explicit blocking dependencies. The original 17-ticket draft is superseded.
