# Heroic Actions — version 0.2.0

This release adds rule information and a GM-assisted action workflow for the existing 11 powers, three traits and two tags. It targets Foundry 13 with system version 3.0.1. It has automated tests and source compatibility checks; live-world testing is still required.

## Start here

1. Replace the installed module folder with this release and reload the world.
2. Open a character sheet and click **Heroic Actions**. If needed, use the macro below.
3. On an existing character, the GM clicks **Update included content**. This creates a recovery Actor before replacing the descriptions and power settings on linked included Items. It preserves Item IDs, custom names, artwork, effects, equipment and current resources. Customized descriptions/settings on those linked Items are replaced.
4. Target tokens on the canvas. The GM clicks **Use / resolve**, confirms the applicable action and conditions, and follows the prompts. Players can send requests to chat; requests do not spend resources.
5. For attacks, resolve edges and troubles on the native roll card first. The GM then clicks **Apply Heroic outcome** on that card to apply damage. Do not apply a second damage result manually.

```js
game.modules.get('heroic-character-creator').api.actions(game.actors.get('ACTOR_ID'));
```

Imported Items are not matched by name. The update button only handles Items linked to the creator's included catalogue, including the earlier module ID. Imported/custom content keeps its own native behavior. A failed operation displays a recovery warning; inspect current resources and effects before correcting it manually. Foundry document writes are not transactional.

## Coverage

| Entry | Rules page | Implemented | GM responsibility |
| --- | --- | --- | --- |
| Inspiration | 105 | Timed edge on Heroic Actions checks | Choose an ally in earshot; confirm standard action |
| Slow-Motion Dodge | 118 | Add trouble to an unresolved native Agility-defense attack before rerolls | Confirm incoming attack and available reaction |
| Attack Stance | 83 | Native Active Effect adds another Melee ability bonus to damage | End concentration when interrupted |
| Counterstrike Technique | 90 | Require Attack Stance, spend 5 Focus, apply half entered regular damage | Confirm damaging close attack; enter regular damage after applicable resistance, before Fantastic doubling |
| Defense Stance | 91 | Trouble on Heroic Actions close attacks; removed after a successful Heroic attack | End on successful attacks resolved elsewhere or concentration loss |
| Unflappable Poise | 128 | Trouble on Heroic Actions close attacks; double with Defense Stance | Include trouble manually in outside rolls |
| Sniping | 120 | Enforce entered distance of at least 20 spaces; spend 5 Focus; Agility roll; regular/triple damage | Confirm measured distance, weapon range, sight, standard plus movement actions, and no movement this turn |
| Snap Shooting | 120 | One roll for up to two targets; half/full regular damage; bleeding marker | Confirm per-target modifiers; resolve ongoing bleeding and recovery |
| Weapons Blazing | 130 | One roll for up to two targets; half/full regular damage; bonus attack control after a Fantastic hit | Select one legal target for each earned bonus attack |
| Change of Plans | 87 | Spend 5 Focus and add an edge to an unresolved roll with trouble | Confirm ally/reaction; apply before rerolls, undo existing rerolls first if necessary |
| Combat Support | 89 | Spend 10 Focus once per combat; fix special die at 1 and protect it from trouble on Heroic Actions checks until the source's next turn | Choose ally in earshot; use Heroic Actions for supported checks |
| Determination | 60 | Omit zero-Focus demoralized trouble on Heroic Actions checks | Other demoralized restrictions still apply |
| Fearless | 60 | Add edge when Fear-related check is selected | Decide whether fear applies |
| Connections | 60 | Ego noncombat check shortcut | Choose contact, TN and resulting help |
| Black Market Access | 63 | Rules reference | Decide available goods and prices; this tag has no fixed numeric bonus |
| Heroic | 64 | Starting Karma equal to rank; GM rest control resets Karma; blocks Villainous/Bloodthirsty during creation | Confirm behavior and qualifying rest |

All six ability controls roll the system's noncombat score and include applicable module benefits. The GM also has basic close/ranged attack controls. Other native bonuses are retained. New characters without the included Heroic tag start with zero Karma; existing characters' current Karma is preserved by creation edits and content updates.

## Timing and resolution boundaries

- Inspiration and Combat Support require an active combat containing the source Actor. Their effects expire at that Actor's next turn or when the combat is deleted. Use **End** to handle unusual turn-order changes, a removed combatant, or manually concluded combat.
- Attack Stance changes the native damage bonus, including outside this panel. Other conditional benefits apply through Heroic Actions. Ordinary sheet rolls do not automatically receive those benefits.
- At zero Health or Focus, managed stances are removed while a resolution GM is connected. Concentration interrupted for other reasons must be ended manually. Determination does not permit Focus spending or concentration at zero Focus.
- Heroic rolls use native dice and reroll controls. Automatic trouble rerolling is not invoked; choose the applicable dice manually. Combat Support's protected die cannot be rerolled by trouble through these controls.
- Damage uses the attacker's values captured at roll time. The GM enters each target's final defense and damage reduction. Different target-specific edges/troubles are not independently simulated by the shared roll; resolve those differences with the GM before applying outcomes.
- Bleeding is a labeled module effect, not an automated recurring-damage scheduler. Other native condition icons are not automatically synchronized.
- Action/reaction budgets, cover, weapon range, allies/enemies, and hearing are GM-confirmed. Sniping distance is entered, not measured by the module. This release does not track movement already used.
- Only Foundry's active GM (or the first active GM by ID if unavailable) performs mutations. Players request powers and make their own ability checks. The workflow requires a connected GM to resolve powers and expire effects.
- Repeated outcome clicks cannot apply damage again. Completed attacks block native rerolls/undo through the wrapped controls. After a partial write failure, the card locks and requires manual inspection rather than an automatic retry.
- Other modules may independently modify resources or effects. Check that another automation is not also applying the same damage or benefit.

## Testing performed

Node tests cover creation limits and preservation, rule metadata, special damage, eligibility, Focus, cancellation, repeated outcomes, failed writes, GM permissions, traits, effect timing, reroll protection and content updates. These use mocked Foundry documents; they do not replace a live test of sheets, dialogs, dice serialization, transferred Active Effects or multiple clients.
