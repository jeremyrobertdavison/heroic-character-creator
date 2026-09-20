# Validation status — 0.3.0

## Completed

- 102 automated Node tests pass: rules, provenance, prerequisite checks, drafts/imports, escaped interface rendering, native field mapping, permissions, source conflicts, edit preservation, recovery snapshots and simulated partial failure.
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

## 0.1.1 regression checklist

- At rank 1, attempt to type 22 into Melee: it must be rejected. Allocate 4 Melee and attempt 2 Agility: the second edit must be rejected.
- Leave an ability point unspent and try Next or a later tab: advancement must be blocked.
- At rank 5, Melee 10 must be rejected; Melee 8 is allowed within the budget. Attempt to reduce rank to 1 with Melee 8: rank must stay at 5 and explain the conflict.
- At rank 1, Change of Plans must be unavailable even with Inspiration.
- At rank 2, Change of Plans requires Inspiration; its prerequisite cannot be removed while it is selected.
- Fill the power/trait allowance and attempt one extra selection. The option must be disabled and no negative remaining balance introduced.
- Create a rank-1 character with Melee 2, Resilience 3 and Vigilance 0: Health must be 90 and Focus 10.
- Confirm GM and player users receive the same hard-limit checks.


## Version 0.2.0 live-world acceptance

- Update a duplicate character's included content. Verify Item IDs, custom artwork/effects, current pools, and recovery copy; verify imported same-name Items are untouched.
- Open Heroic Actions as GM and player. Confirm player requests spend nothing; another active GM cannot resolve concurrently.
- Use Attack Stance, check the native Melee damage bonus, end it, and verify removal. Test zero Focus removes concentration.
- Use Defense Stance plus Unflappable Poise; make a Heroic close attack against the character. Check double trouble and stance removal after a hit.
- Cancel Sniping before and during the native roll dialog. Check no Focus is spent. Resolve a valid Sniping attack; check 5 Focus, triple regular damage on Fantastic, and no repeat damage.
- Use Snap Shooting against two targets. Check each defense and damage reduction, half/full damage, and bleeding marker. Resolve bleeding manually.
- Use Weapons Blazing. Check a Fantastic hit grants a bonus, cancellation preserves it, and a completed bonus cannot be repeated from the same card.
- Test Inspiration and Combat Support on another Actor. Check source-turn expiry, fixed special die and reroll protection. Test once-per-combat enforcement and deleting combat.
- Use Change of Plans and Slow-Motion Dodge on unresolved native rolls. Verify resource cost, correct edge/trouble and duplicate prevention.
- Test Fearless on a fear check; Determination at zero Focus; Connections Ego check; Heroic Karma after rest.
- Reload the world with an unresolved attack and with active effects. Check persisted flags, native dice hydration, ownership and effect timing.
- Test a player and GM in separate browsers, including a transferred GM role and a target on the canvas. Check that no effect is applied twice.


## Version 0.3.0 live-world acceptance

- Verify all 30 origin and 18 occupation choices appear; test Mutant, Magic: Sorcery, Atlantean and an occupation with Connections.
- At insufficient rank, verify the Skrull package is rejected; at rank 3, verify its five required powers consume picks.
- Add Extra Occupation, choose Lawyer, then remove the trait. Verify only its package-specific grants are removed.
- Choose a specific Surprising Power; verify it waives only that power's rank/origin restriction and preserves prerequisites and pick costs.
- Customize an elemental type, blunt/sharp weapon, God Heritage and a contact. Verify details save and survive content upgrades.
- Search and filter the full catalogue. Add an option and verify filters remain selected.
- Open Heroic Actions for a new reference-only power; verify Post rules to chat changes no Focus, Health or Active Effects.
- Test an existing 0.2.0 character and an existing draft; verify original included powers still use their previous action workflows.
- Attempt a 5-Focus action at 5 current Focus; verify it is rejected. At 6 Focus, verify it leaves 1.

## 0.3.1 recovery-folder regression

With only Heroic Character Creator enabled, create an ordinary Actor folder, then edit and save an existing character. Confirm a recovery copy is created and edits save without a flag-scope error. Repeat with an existing recovery folder; confirm it is reused. Older recovery folders carrying the retired module's stored recovery flag should also be reused without activating that module. The included-content update uses the same recovery path and should also complete.
