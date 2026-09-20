# Validation status — 0.1.0

## Completed

- 38 automated Node tests pass: rules, provenance, prerequisite checks, drafts/imports, escaped interface rendering, native field mapping, permissions, source conflicts, edit preservation, recovery snapshots and simulated partial failure.
- JavaScript files pass syntax checks.
- Native field mappings and Item types were compared with the supported system source and sample character export.
- Release ZIP contents, entry points, manifest asset paths and version consistency are checked before delivery.

The adapter tests use a document test double, not a running Foundry server. The interface tests verify generated markup and application methods, not browser layout or the full Foundry UI lifecycle.

## Not completed here

- Live installation and sheet hooks in Foundry 13.
- Real browser visual/layout and interaction smoke test. No browser binary was present in the development environment, and downloading one timed out.
- Real Foundry document-schema validation, Active Effect behavior, module coexistence and socket/concurrent-user integration.
- Full core-rulebook catalogue and exception audit.

The package targets Foundry generation 13. The manifest's generation declaration is a compatibility target, not evidence of a completed live-world certification.

## First-run checklist

Use a supported test world before updating campaign characters.

1. Install and enable the module. Confirm there are no browser-console initialization errors.
2. Open it from the Actors directory. Confirm the settings fallback also opens it.
3. Enter a character name and choose rank 1. Allocate Resilience 2 and Vigilance 3, leaving other abilities at zero.
4. Select Special Training and Adventurer. Confirm four granted entries: Determination, Fearless, Connections: Super Heroes or Villains, and Black Market Access.
5. Add Inspiration from Options. Confirm it appears once and reduces the available power picks by one.
6. On Review, inspect Health 60, Focus 90, initiative 3, Run 5, and Climb/Swim/Jump 3. Read and acknowledge manual-review notes, then Create Character.
7. Confirm the native sheet opens, the options exist as native Items, and ordinary system rolls still work.
8. Open Creator on this character's sheet. Confirm current data loads. Close without saving and verify nothing changed.
9. Save a small change as GM. Confirm the original updates and a GM-only recovery Actor appears. Log in as a player and verify the recovery Actor is not visible.
10. On a duplicate of a legacy character, verify inventory, biography, artwork, Effects, token settings, current resources and extra movement modes survive a save.
11. Change the original through its native sheet while the creator is open. Confirm the creator refuses to overwrite the changed character.
12. Test a player with Create Actor permission: create a character; verify existing-character updates are disabled but Save as New works on their own character. Test a player without permission as well.
13. Test artwork browsing, Item drag/drop, World Items, an accessible Item compendium, Actor JSON import, draft resume, and exported-draft import.
14. Disable the module. Confirm the created character remains usable on the ordinary system sheet.

If a save reports an incomplete operation, inspect the recovery copy before retrying. Consult the README for recovery and token reassignment considerations.
