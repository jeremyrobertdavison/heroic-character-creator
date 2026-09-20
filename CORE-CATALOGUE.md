# Core catalogue — 0.3.0

The creator now includes the core book's character options, with rules information and printed-page references:

| Category | Core entries |
| --- | ---: |
| Powers | 321 |
| Traits | 57 |
| Tags | 48 |
| Origins | 30 |
| Occupations | 18 |

Origin variants and numbered powers are listed separately. The selectable catalogue also contains 18 explicit package specializations, such as Connections: Military and Immunity: Gamma Radiation. These are variations of the core labels, not additional book entries. See CORE-INVENTORY.md for the base-entry checklist.

## Creation workflow

1. Set the character's final rank on Identity. The maximum is always 6; ability scores remain limited to rank + 3.
2. Allocate the ability points, then select origin and occupation on Backstory. Expand each package to read its description and notes.
3. Free package traits and tags are added automatically. Required origin powers **consume power picks**, including prerequisite powers; they are not free bonuses. Selecting an origin whose powers exceed the rank or budget is rejected.
4. On Options, filter by category, power set, available options, or search text. Known rank prerequisites, power chains, alternative prerequisites and required tags are checked before selection.
5. Use **Customize** to complete required details, including a divine domain, elemental type or weapon type. An elemental power's description includes the elemental special-effects reference. Melee Weapons descriptions include blunt/sharp effects.
6. Extra Occupation and Extraordinary Origin offer a package selector. The chosen package's benefits are granted with separate provenance and removed when its enabling trait is removed. Extraordinary origins still require the GM's agreement.
7. Surprising Power requires selecting a specific power. It waives that power's rank and origin requirements as described by the trait; its power prerequisites remain mandatory. It does not change the character's rank cap, ability cap or pick budgets.
8. Review all remaining details and static bonuses before saving. Unspecified required choices block final save. As before, editing an existing Actor is GM-only and creates a recovery copy.

If native-sheet edits removed a required package benefit, **Reapply package benefits** on Backstory restores it in the draft for review.

The original starter IDs remain unchanged, preserving existing characters and draft provenance. Native sheet Items retain their IDs when only their explicitly configured choice changes. Imported/custom Items are not automatically identified by name.

## Package boundaries

- Common/conditional tags, such as Extreme Appearance for a concealed implant or Villainous for an assassin, are not assumed. Add them on Options when applicable.
- High Tech: Pym Particles requires selecting Grow 1, Shrink 1, or both. The initial package includes Tech Reliance; later independence from equipment is resolved on the native sheet.
- Vampire and werewolf packages describe the supernatural form and restrict other powers unless another origin or a specific Surprising Power entitlement permits them.
- Spirit of Vengeance requires rank 4 and its listed powers. Additional choices are restricted to the appropriate magic/elemental theme when it is the sole origin. Elemental choices must use Hellfire.
- Transformation, possession, symbiote bonding, equipment loss, resurrection and changes of form are not automated. Enter the intended final rank; the creator never silently raises it beyond 6.
- Multiple-set powers offer a choice for the power-set budget. The complete native set membership remains on the Item. Imported multi-set entries without a choice retain the existing conservative budget handling and warning.
- Numbered power prerequisites remain separate picks. Apply the highest applicable effect; their bonuses do not stack. The creator does not install cumulative effects for the newly added powers.

## Rules information versus automation

**Catalogue completeness does not mean complete combat automation.** The earlier eleven powered workflows remain available in Heroic Actions. Newly added powers and traits have readable rules and a **Post rules to chat** button; they do not silently spend Focus or create generic effects. Static bonuses, such as Battle Ready's Focus increase, must be applied on the native sheet or entered as reviewed totals during creation.

Native numeric fields cannot express every variable cost, range or duration. For these entries, the written rules are authoritative; the numeric fields are only defaults and do not drive an automated action. Source wording that differs between a power listing and its detailed description is resolved using the detailed entry. The printed “Copy Powers” prerequisite for Swipe Power is linked to the existing Copy Power entry.

The existing automated Focus workflows were corrected to enforce the general spending limits: spend no more than five times rank at once and leave at least 1 Focus. This does not prevent damage from reducing Focus to zero.

The module includes core-book content only. Expansion-book options are not part of this release. Imported options remain available for additional content.

## Validation

102 automated tests cover the existing workflows plus catalogue totals, unique IDs, all prerequisite references, acyclic chains, numbered powers, every origin and occupation, paid origin powers, extra-package removal, alternative requirements, restricted tags, specific Surprising Power entitlements, search controls and Focus limits. Native Item fields were checked against the supplied system 3.0.1 schema.

The descriptions were transcribed from the supplied scanned book, with line breaks and OCR artifacts cleaned. Printed page references are included for review. Live testing in Foundry 13 remains required, particularly for option dialogs, large-catalogue navigation, transferred effects and existing-world integration.
