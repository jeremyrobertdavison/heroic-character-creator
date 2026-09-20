# Heroic Character Creator

A guided superhero character creator and editor for Foundry Virtual Tabletop 13.

**Version 0.1.1 is a prototype.** It provides a usable creation workflow, core budget checks, a small starter catalogue, native Item imports, and GM editing with recovery copies. It does **not** contain the complete core-rulebook catalogue or enforce every character-creation exception. Every build requires manual rules review.

## Requirements

- Foundry VTT 13.
- Supported game system: `mvrpg` (3.0.1 data structure). This release is not system-agnostic.
- A GM for updating an existing character. Players with Create Actor permission can create characters and save owned characters as new copies.

Compatibility is based on the supported system’s character data structure; version labels alone are not used as a strict gate.

## Installation

Once release assets are published, install from this manifest URL:

```text
https://github.com/jeremyrobertdavison/heroic-character-creator/releases/latest/download/module.json
```

In Foundry Setup, open **Add-on Modules → Install Module**, paste the URL into **Manifest URL**, and install. Launch a supported world and enable **Heroic Character Creator** in **Manage Modules**.

For manual installation, extract the release ZIP's `heroic-character-creator` folder into your Foundry user-data `Data/modules` directory. The resulting path must be `Data/modules/heroic-character-creator/module.json`. Restart Foundry, then enable the module in a supported world. Do not install it as a game system.

Start in a test world or use a duplicate character while evaluating this prototype.

## Replacing the earlier prototype

Disable the earlier Character Creator module before enabling Heroic Character Creator. Existing native characters remain usable, and this module reads the earlier prototype’s build metadata and exported drafts. The renamed package is a separate module ID, so install it using the new manifest URL.

## Opening the creator

- **Actors directory:** click **Create Character**.
- **Existing character sheet:** click **Open Creator** in the window header.
- **Fallback:** Configure Settings → Heroic Character Creator → Open Character Creator.
- Macro for a new character:

```js
game.modules.get("heroic-character-creator").api.create();
```

- Macro for an existing character:

```js
game.modules.get("heroic-character-creator").api.open(game.actors.get("ACTOR_ID"));
```

Use an Actor from the directory. Unlinked token Actors and the `npc` type are not supported in this release.

## Workflow

1. **Identity:** enter a name, portrait, rank (1–6).
2. **Abilities:** allocate ability scores. Exchange power picks for ability points or additional traits if desired.
3. **Backstory:** choose a starter package or enter other origins/occupations manually.
4. **Options:** add powers, traits and tags. Load your world Items or an accessible Item compendium, import JSON, drag an Item onto the creator, or make a custom option.
5. **Review:** inspect totals, proposed changes, errors and manual-review notes. Acknowledge the coverage limitations, then save.

No live character changes occur until a save. Granted options show their source. Package grants are changed through Backstory. A manually selected option that is also granted by a package remains selected when that package is removed.

### Included starter content

- Special Training origin with its Determination grant.
- Adventurer occupation with Fearless, Connections: Super Heroes or Villains, and Black Market Access.
- Heroic tag.
- Eleven example powers: Inspiration, Slow-Motion Dodge, Attack Stance, Counterstrike Technique, Defense Stance, Unflappable Poise, Sniping, Snap Shooting, Weapons Blazing, Change of Plans, and Combat Support.

The powers use short original summaries and native system Item fields. The example's prerequisite metadata is transcribed from the supplied character export and has not received a complete PDF audit. The UI marks these options for manual review. It does not automatically execute their combat effects.

### Importing your own content

On **Options**, select **World Items** or an accessible **Item compendium**, then click **Load source**. Select items from the catalogue that appears.

**Import JSON** accepts a native Actor export, an Item export, or a compendium export containing Items or Actors with embedded Items. Only `power`, `trait`, and `tag` Items are imported. JournalEntry compendiums contain reference material, so they cannot be used as selectable character options.

Imported options preserve their native descriptions, fields, and effects when saved. The module does not infer eligibility from their names or prose. They remain marked for manual review. Imports do not modify the source compendium or create world Items.

Imported options are available in the current creator window. Selected options are included in saved drafts and character build metadata; unselected imported catalogue entries must be loaded again next time. The source catalogue does not include an actor-compendium browser; export Actor JSON to import its embedded options.

Custom powers require the supported system’s internal power-set key, such as `martialArts`, `rangedWeapons`, or `basic`. Invalid keys are rejected. Custom traits can be separately named for repeated choices, such as `Connections: Police` and `Connections: Military`.

### Legacy character reconciliation

The creator loads existing powers, traits and tags without silently matching them to starter records by name. Existing traits initially count as discretionary. Starter backstory packages track their own grants. Manual grant relabeling and the creator’s GM exception override have been removed. Record legitimate exchanged picks on Abilities. Nonstandard legacy allocations must be handled on the native character sheet; the creator will not save a build that violates its hard limits.

This release supports manual reconciliation rather than automatically reverse-engineering a legacy character. Imported and starter versions of the same power are separate options; do not add both unless intentional. Prerequisite links on starter options reference other starter options; mixed-source equivalents require proper catalogue mappings before the creator can treat them as interchangeable.

### Statistics and effects

New characters default to basic calculated Health, Focus, initiative and ordinary movement. Existing characters default to their stored totals. Uncheck **Calculate basic totals** to enter reviewed manual totals, including static power/trait/size adjustments.

Health and Focus maxima each have a minimum of 10, including when Resilience or Vigilance is zero or negative (core rules, printed p. 19). Basic movement does not implement every negative-score, size or power exception. Effect-adjusted totals must not be manually added again to stored base fields.

The module does not clear existing Active Effects, inventory, special movement modes, initiative edge, biography, token settings, or unrelated bonus fields. New starter powers have no automated Active Effects. Existing characters retain current Health, Focus and Karma, even if a changed maximum is lower. Resolve any over-maximum current pool on the native sheet. Save as New preserves a copied character's current pools too.

## Hard creation limits in 0.1.1

- Rank is always 1–6. There is no configurable rank cap.
- Each ability is a whole number from -3 through rank + 3. Controls also limit spending to the remaining pool. Invalid typed or pasted values are rejected.
- Spend every available ability point before advancing beyond Abilities. Direct tab clicks and final saves enforce the same gate. You can still return to Identity to adjust rank or remain on Abilities to edit exchanges.
- Rank changes are rejected if they would invalidate current scores, point budgets, traits or known power prerequisites. Reduce allocations or remove dependent options first; the creator does not silently erase your choices.
- Power and discretionary-trait limits are enforced before adding an option. Power-set changes account for lost thematic picks.
- Known rank and prerequisite requirements disable the power’s Add button and show the reason. Required powers cannot be removed while a selected power depends on them.
- The same limits apply to GMs. There is no creator override or manual “count as grant” shortcut. Use the native character sheet for nonstandard adjustments.
- Unspent power picks and discretionary traits may remain; the full-spend gate applies to ability points.

For characters created by 0.1.0 with a zero maximum pool, open Review and enable basic total calculation, or enter the corrected maximum manually. Saving an edit preserves the current pool to avoid healing an injured character. For an uninjured test character with Vigilance 0, set both maximum and current Focus to 10 on the native sheet.

## Drafts

Edits automatically save a draft in this browser for the current world, user and character. **Save draft** also saves explicitly. Use **Resume draft** before making new changes when reopening a creator. **Export draft** creates a portable JSON file; import that file into a new creator to make a new character on another device or give the draft to the GM.

Drafts are not world backups. Clearing browser data removes local drafts. Existing-character drafts record a source baseline; the creator refuses to apply them over a character that has changed since the draft began. Import a stale draft into a new creator to preserve it as a separate character, or reconcile against the current original manually.

## Safe editing and recovery

Existing-character updates are GM-only in 0.1.1. Before writing, the module:

1. Checks ownership, actor type, and source data for intervening changes.
2. Creates a recovery Actor with no player ownership in **Character Creator — Recovery**.
3. Checks the source again, adds new Items, updates fields, removes explicitly deselected Items, and records build metadata.
4. Checks the resulting fields and selected Item IDs.

A recovery copy is made for every existing-character save. It is a complete pre-save Actor copy, including embedded Items and Effects. Recovery copies are retained until the GM manually removes them.

If a save fails partway through, **do not repeat it blindly**. Open the recovery copy and inspect the original. You can export the recovery Actor, duplicate it as a replacement, rename it, and restore intended ownership manually. Relink affected tokens or user character assignments if replacing the original with a different Actor. Automatic in-place rollback is not included.

Foundry writes are not a transaction. Source checks protect against detected intervening changes but cannot lock out every simultaneous external edit. Avoid editing the same character from two places during a save. An error after creation can leave a newly created Actor present; check the Actors directory before retrying.

## Coverage

Implemented checks include ordinary rank and ability limits, rank-based ability and trait budgets, Basic-excluded thematic bonuses, one-for-one power exchanges, starter prerequisites/rank requirements, and the starter Special Training restriction. Grant provenance is tracked for starter packages and manual grant classifications.

Not fully covered: complete origin/occupation choices, multiple structured backstory packages, all published options, advanced power-set counting, Surprising Power exceptions, full repeatability/variant rules, all static modifiers and stacking, automatic reconciliation of existing automation, and conditional combat effects. General book legality is never certified by the prototype. Imported/custom powers without structured prerequisites still require manual eligibility review; known starter prerequisites are enforced before selection. The creator enforces the same implemented hard limits for GMs and players. Nonstandard adjustments can be made on the native sheet afterward.

Disabling the module leaves native Actors and Items usable. Build metadata remains in module flags, and ordinary system sheets continue to work.

## Development and validation

There is no build step or runtime npm dependency. Run automated rules and adapter tests with Node 20+:

```sh
npm test
```

Tests exercise budgets, prerequisites, grants, permission restrictions, new native data, edit preservation, stale baselines, recovery copies and injected partial failures. See `docs/TESTING.md` for the exact validation status and the live Foundry acceptance checklist.

An independent community project. Rulebook PDFs and artwork are not included. Refer to your game’s books for complete rules text.
