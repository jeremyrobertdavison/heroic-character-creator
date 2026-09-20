# 0.3.0 — Core catalogue expansion

- Expanded to 321 powers, 57 traits, 48 tags, 30 origins and 18 occupations, plus package-specific label variants.
- Added known rank/power/tag prerequisites, alternatives and numbered chains.
- Added all origin/occupation packages, paid required origin powers and extra-package traits.
- Added specialization dialogs, power-set filters and an available-only filter.
- Added scoped Surprising Power choices without changing character rank or ability caps.
- Preserved original starter IDs, existing automation and recovery-backed edits.
- Kept new combat effects explicitly manual, with rules-to-chat controls.
- Corrected automated Focus spending to leave at least 1 Focus and obey the rank-based spending limit.
- Expanded validation to 102 passing tests. Live Foundry testing remains required.

# 0.2.0 — Included rules and Heroic Actions

- Added core rule information and page references for the 11 included powers, three traits and two tags.
- Added Heroic Actions on sheets: ability checks, player requests and GM-assisted power resolution.
- Implemented Focus spending, stances, timed ally benefits, reactions, special damage, bleeding markers and earned bonus attacks.
- Added contextual Fearless/Determination handling and Heroic Karma behavior.
- Added recovery-backed content upgrades for existing linked Items.
- Added cancellation, permission, timing, damage and replay protection tests.
- Preserved hard creation limits from 0.1.1. Live Foundry testing remains required; see docs/HEROIC-ACTIONS.md for automation boundaries.

# Changelog

## 0.1.1

- Fixed rank range at 1–6 and removed the optional rank cap.
- Enforced ability caps, allocation budgets and complete ability spending before advancement or saving.
- Rejected rank changes that invalidate existing allocations or options.
- Disabled unavailable powers before selection; enforced power and trait budgets, thematic-bonus changes and known prerequisites.
- Removed GM overrides and manual trait-grant shortcuts from the creator.
- Corrected the minimum Health and Focus maxima to 10.
- Added regression tests for the reported creation failures.

## 0.1.0

Initial prototype for Foundry 13.

- Five-step character creator and editor.
- Native system Actor/Item output and ordinary core budget checks.
- Eleven starter powers and two backstory package examples.
- World Item, Item compendium, Actor/Item JSON, drag/drop and custom option support.
- Local drafts and portable JSON draft export/import.
- GM-only existing-character updates with restricted recovery copies and source-conflict detection.
- Explicit manual-review requirements and limited rules/content coverage.
