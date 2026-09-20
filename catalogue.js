export const STARTER = [
  {
    "id": "starter:inspiration",
    "name": "Inspiration",
    "type": "power",
    "sets": [
      "basic"
    ],
    "minRank": 1,
    "requires": [],
    "trainingAllowed": true,
    "reviewed": true,
    "source": "Core Rulebook, p. 105 (supplied PDF).",
    "description": "Power Set: None. Prerequisites: None. Action: Standard. Duration: 1 round. The character inspires an ally in earshot. The ally gains an edge on all action checks until the start of the character’s next turn.",
    "item": {
      "name": "Inspiration",
      "type": "power",
      "img": "icons/svg/lightning.svg",
      "system": {
        "powerSets": [
          "basic"
        ],
        "actions": [
          "standard"
        ],
        "duration": "oneRound",
        "range": {
          "_value": "0",
          "multiplyByRank": false,
          "reach": false
        },
        "cost": 0,
        "roll": {
          "hasRoll": false,
          "type": "combat",
          "ability": "agility",
          "against": "agility",
          "lifepoolTarget": "health",
          "bonus": 0,
          "edges": 0,
          "troubles": 0
        },
        "description": "<p><strong>Power Set:</strong> None</p><p><strong>Prerequisites:</strong> None</p><p><strong>Action:</strong> Standard</p><p><strong>Duration:</strong> 1 round</p><p>The character inspires an ally in earshot. The ally gains an edge on all action checks until the start of the character’s next turn.</p><p><em>Core Rulebook, p. 105 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Applies a timed edge to Heroic Actions checks. The GM confirms hearing and action availability.</p>"
      },
      "effects": []
    },
    "automation": "Applies a timed edge to Heroic Actions checks. The GM confirms hearing and action availability.",
    "contentVersion": "0.3.0",
    "automationMode": "automated"
  },
  {
    "id": "starter:slow-motion-dodge",
    "name": "Slow-Motion Dodge",
    "type": "power",
    "sets": [
      "basic"
    ],
    "minRank": 1,
    "requires": [],
    "trainingAllowed": true,
    "reviewed": true,
    "source": "Core Rulebook, p. 118 (supplied PDF).",
    "description": "Power Set: None. Prerequisites: None. Action: Reaction. Trigger: An enemy makes an attack against the character’s Agility defense.. Duration: Instant. The enemy has trouble on the attack.",
    "item": {
      "name": "Slow-Motion Dodge",
      "type": "power",
      "img": "icons/svg/lightning.svg",
      "system": {
        "powerSets": [
          "basic"
        ],
        "actions": [
          "reaction"
        ],
        "duration": "instant",
        "range": {
          "_value": "0",
          "multiplyByRank": false,
          "reach": false
        },
        "cost": 0,
        "roll": {
          "hasRoll": false,
          "type": "combat",
          "ability": "agility",
          "against": "agility",
          "lifepoolTarget": "health",
          "bonus": 0,
          "edges": 0,
          "troubles": 0
        },
        "description": "<p><strong>Power Set:</strong> None</p><p><strong>Prerequisites:</strong> None</p><p><strong>Action:</strong> Reaction</p><p><strong>Trigger:</strong> An enemy makes an attack against the character’s Agility defense.</p><p><strong>Duration:</strong> Instant</p><p>The enemy has trouble on the attack.</p><p><em>Core Rulebook, p. 118 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Adds trouble to a selected, unresolved native attack roll before rerolls. The GM confirms the trigger.</p>"
      },
      "effects": []
    },
    "automation": "Adds trouble to a selected, unresolved native attack roll before rerolls. The GM confirms the trigger.",
    "contentVersion": "0.3.0",
    "automationMode": "automated"
  },
  {
    "id": "starter:attack-stance",
    "name": "Attack Stance",
    "type": "power",
    "sets": [
      "martialArts"
    ],
    "minRank": 1,
    "requires": [],
    "trainingAllowed": true,
    "reviewed": true,
    "source": "Core Rulebook, p. 83 (supplied PDF).",
    "description": "Power Set: Martial Arts. Prerequisites: None. Action: Standard. Duration: Concentration. The character doubles their Melee ability bonus to damage.",
    "item": {
      "name": "Attack Stance",
      "type": "power",
      "img": "icons/svg/lightning.svg",
      "system": {
        "powerSets": [
          "martialArts"
        ],
        "actions": [
          "standard"
        ],
        "duration": "concentration",
        "range": {
          "_value": "0",
          "multiplyByRank": false,
          "reach": false
        },
        "cost": 0,
        "roll": {
          "hasRoll": false,
          "type": "combat",
          "ability": "agility",
          "against": "agility",
          "lifepoolTarget": "health",
          "bonus": 0,
          "edges": 0,
          "troubles": 0
        },
        "description": "<p><strong>Power Set:</strong> Martial Arts</p><p><strong>Prerequisites:</strong> None</p><p><strong>Action:</strong> Standard</p><p><strong>Duration:</strong> Concentration</p><p>The character doubles their Melee ability bonus to damage.</p><p><em>Core Rulebook, p. 83 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Applies a native Active Effect to Melee damage. End concentration using Heroic Actions.</p>"
      },
      "effects": []
    },
    "automation": "Applies a native Active Effect to Melee damage. End concentration using Heroic Actions.",
    "contentVersion": "0.3.0",
    "automationMode": "automated"
  },
  {
    "id": "starter:counterstrike-technique",
    "name": "Counterstrike Technique",
    "type": "power",
    "sets": [
      "martialArts"
    ],
    "minRank": 2,
    "requires": [
      "starter:attack-stance"
    ],
    "trainingAllowed": true,
    "reviewed": true,
    "source": "Core Rulebook, p. 90 (supplied PDF).",
    "description": "Power Set: Martial Arts. Prerequisites: Attack Stance, Rank 2. Action: Reaction. Trigger: While Attack Stance is active, a close attack against the character does damage.. Duration: Instant. Cost: 5 Focus. The character deals half the attacker’s regular damage to the attacker.",
    "item": {
      "name": "Counterstrike Technique",
      "type": "power",
      "img": "icons/svg/lightning.svg",
      "system": {
        "powerSets": [
          "martialArts"
        ],
        "actions": [
          "reaction"
        ],
        "duration": "instant",
        "range": {
          "_value": "0",
          "multiplyByRank": false,
          "reach": false
        },
        "cost": 5,
        "roll": {
          "hasRoll": false,
          "type": "combat",
          "ability": "agility",
          "against": "agility",
          "lifepoolTarget": "health",
          "bonus": 0,
          "edges": 0,
          "troubles": 0
        },
        "description": "<p><strong>Power Set:</strong> Martial Arts</p><p><strong>Prerequisites:</strong> Attack Stance, Rank 2</p><p><strong>Action:</strong> Reaction</p><p><strong>Trigger:</strong> While Attack Stance is active, a close attack against the character does damage.</p><p><strong>Duration:</strong> Instant</p><p><strong>Cost:</strong> 5 Focus</p><p>The character deals half the attacker’s regular damage to the attacker.</p><p><em>Core Rulebook, p. 90 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Deducts Focus and applies half the regular damage entered by the GM to the selected attacker.</p>"
      },
      "effects": []
    },
    "automation": "Deducts Focus and applies half the regular damage entered by the GM to the selected attacker.",
    "contentVersion": "0.3.0",
    "automationMode": "automated"
  },
  {
    "id": "starter:defense-stance",
    "name": "Defense Stance",
    "type": "power",
    "sets": [
      "martialArts"
    ],
    "minRank": 1,
    "requires": [],
    "trainingAllowed": true,
    "reviewed": true,
    "source": "Core Rulebook, p. 91 (supplied PDF).",
    "description": "Power Set: Martial Arts. Prerequisites: None. Action: Standard. Duration: Concentration. Any close attacks made against the character have trouble until they are successfully attacked in this combat.",
    "item": {
      "name": "Defense Stance",
      "type": "power",
      "img": "icons/svg/lightning.svg",
      "system": {
        "powerSets": [
          "martialArts"
        ],
        "actions": [
          "standard"
        ],
        "duration": "concentration",
        "range": {
          "_value": "0",
          "multiplyByRank": false,
          "reach": false
        },
        "cost": 0,
        "roll": {
          "hasRoll": false,
          "type": "combat",
          "ability": "agility",
          "against": "agility",
          "lifepoolTarget": "health",
          "bonus": 0,
          "edges": 0,
          "troubles": 0
        },
        "description": "<p><strong>Power Set:</strong> Martial Arts</p><p><strong>Prerequisites:</strong> None</p><p><strong>Action:</strong> Standard</p><p><strong>Duration:</strong> Concentration</p><p>Any close attacks made against the character have trouble until they are successfully attacked in this combat.</p><p><em>Core Rulebook, p. 91 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Tracks the stance. Its trouble is applied to close attacks made through Heroic Actions; use End after a successful attack from outside this workflow.</p>"
      },
      "effects": []
    },
    "automation": "Tracks the stance. Its trouble is applied to close attacks made through Heroic Actions; use End after a successful attack from outside this workflow.",
    "contentVersion": "0.3.0",
    "automationMode": "automated"
  },
  {
    "id": "starter:unflappable-poise",
    "name": "Unflappable Poise",
    "type": "power",
    "sets": [
      "martialArts"
    ],
    "minRank": 3,
    "requires": [
      "starter:defense-stance"
    ],
    "trainingAllowed": true,
    "reviewed": true,
    "source": "Core Rulebook, p. 128 (supplied PDF).",
    "description": "Power Set: Martial Arts. Prerequisites: Defense Stance, Rank 3. Duration: Permanent. Any close attacks against the character have trouble. While they use Defense Stance, such attacks have double trouble.",
    "item": {
      "name": "Unflappable Poise",
      "type": "power",
      "img": "icons/svg/lightning.svg",
      "system": {
        "powerSets": [
          "martialArts"
        ],
        "actions": [],
        "duration": "permanent",
        "range": {
          "_value": "0",
          "multiplyByRank": false,
          "reach": false
        },
        "cost": 0,
        "roll": {
          "hasRoll": false,
          "type": "combat",
          "ability": "agility",
          "against": "agility",
          "lifepoolTarget": "health",
          "bonus": 0,
          "edges": 0,
          "troubles": 0
        },
        "description": "<p><strong>Power Set:</strong> Martial Arts</p><p><strong>Prerequisites:</strong> Defense Stance, Rank 3</p><p><strong>Duration:</strong> Permanent</p><p>Any close attacks against the character have trouble. While they use Defense Stance, such attacks have double trouble.</p><p><em>Core Rulebook, p. 128 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Adds trouble to close attacks against this character through Heroic Actions, with double trouble during Defense Stance.</p>"
      },
      "effects": []
    },
    "automation": "Adds trouble to close attacks against this character through Heroic Actions, with double trouble during Defense Stance.",
    "contentVersion": "0.3.0",
    "automationMode": "automated"
  },
  {
    "id": "starter:sniping",
    "name": "Sniping",
    "type": "power",
    "sets": [
      "rangedWeapons"
    ],
    "minRank": 2,
    "requires": [],
    "trainingAllowed": true,
    "reviewed": true,
    "source": "Core Rulebook, p. 120 (supplied PDF).",
    "description": "Power Set: Ranged Weapons. Prerequisites: Rank 2. Action: Both standard and movement (character cannot move this turn). Duration: Instant. Cost: 5 Focus. The character makes a ranged attack against an enemy at least 20 spaces away. If the attack is a success, the enemy takes regular damage. On a Fantastic success, the enemy takes triple damage instead.",
    "item": {
      "name": "Sniping",
      "type": "power",
      "img": "icons/svg/lightning.svg",
      "system": {
        "powerSets": [
          "rangedWeapons"
        ],
        "actions": [
          "standard",
          "movement"
        ],
        "duration": "instant",
        "range": {
          "_value": "0",
          "multiplyByRank": false,
          "reach": false
        },
        "cost": 5,
        "roll": {
          "hasRoll": true,
          "type": "combat",
          "ability": "agility",
          "against": "agility",
          "lifepoolTarget": "health",
          "bonus": 0,
          "edges": 0,
          "troubles": 0
        },
        "description": "<p><strong>Power Set:</strong> Ranged Weapons</p><p><strong>Prerequisites:</strong> Rank 2</p><p><strong>Action:</strong> Both standard and movement (character cannot move this turn)</p><p><strong>Duration:</strong> Instant</p><p><strong>Cost:</strong> 5 Focus</p><p>The character makes a ranged attack against an enemy at least 20 spaces away. If the attack is a success, the enemy takes regular damage. On a Fantastic success, the enemy takes triple damage instead.</p><p><em>Core Rulebook, p. 120 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Checks the GM-entered distance, deducts Focus, rolls Agility, and applies regular or triple damage after GM resolution.</p>"
      },
      "effects": []
    },
    "automation": "Checks the GM-entered distance, deducts Focus, rolls Agility, and applies regular or triple damage after GM resolution.",
    "contentVersion": "0.3.0",
    "automationMode": "automated"
  },
  {
    "id": "starter:snap-shooting",
    "name": "Snap Shooting",
    "type": "power",
    "sets": [
      "rangedWeapons"
    ],
    "minRank": 1,
    "requires": [],
    "trainingAllowed": true,
    "reviewed": true,
    "source": "Core Rulebook, p. 120 (supplied PDF).",
    "description": "Power Set: Ranged Weapons. Prerequisites: None. Action: Standard. Duration: Instant. The character splits their attack to make two ranged attacks against separate targets (or they can focus a single attack on a single target). Make a single Agility check and compare it to the targets’ Agility defenses. On a success, an affected target takes half regular damage. On a Fantastic success, an affected target takes full damage and is bleeding.",
    "item": {
      "name": "Snap Shooting",
      "type": "power",
      "img": "icons/svg/lightning.svg",
      "system": {
        "powerSets": [
          "rangedWeapons"
        ],
        "actions": [
          "standard"
        ],
        "duration": "instant",
        "range": {
          "_value": "0",
          "multiplyByRank": false,
          "reach": false
        },
        "cost": 0,
        "roll": {
          "hasRoll": true,
          "type": "combat",
          "ability": "agility",
          "against": "agility",
          "lifepoolTarget": "health",
          "bonus": 0,
          "edges": 0,
          "troubles": 0
        },
        "description": "<p><strong>Power Set:</strong> Ranged Weapons</p><p><strong>Prerequisites:</strong> None</p><p><strong>Action:</strong> Standard</p><p><strong>Duration:</strong> Instant</p><p>The character splits their attack to make two ranged attacks against separate targets (or they can focus a single attack on a single target). Make a single Agility check and compare it to the targets’ Agility defenses. On a success, an affected target takes half regular damage. On a Fantastic success, an affected target takes full damage and is bleeding.</p><p><em>Core Rulebook, p. 120 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> One roll for up to two targets; applies half/full damage and a bleeding marker. Bleeding’s ongoing damage and recovery are manual.</p>"
      },
      "effects": []
    },
    "automation": "One roll for up to two targets; applies half/full damage and a bleeding marker. Bleeding’s ongoing damage and recovery are manual.",
    "contentVersion": "0.3.0",
    "automationMode": "automated"
  },
  {
    "id": "starter:weapons-blazing",
    "name": "Weapons Blazing",
    "type": "power",
    "sets": [
      "rangedWeapons"
    ],
    "minRank": 1,
    "requires": [
      "starter:snap-shooting"
    ],
    "trainingAllowed": true,
    "reviewed": true,
    "source": "Core Rulebook, p. 130 (supplied PDF).",
    "description": "Power Set: Ranged Weapons. Prerequisites: Snap Shooting. Action: Standard. Duration: Instant. The character splits their attack to make two ranged attacks against separate targets (or they can focus a single attack on a single target). Make a single Agility check and compare it to the targets’ Agility defenses. On a success, the affected target takes half regular damage. On a Fantastic success, the affected target takes full damage, and the character can make a bonus attack with this power against any available target, with the same effect.",
    "item": {
      "name": "Weapons Blazing",
      "type": "power",
      "img": "icons/svg/lightning.svg",
      "system": {
        "powerSets": [
          "rangedWeapons"
        ],
        "actions": [
          "standard"
        ],
        "duration": "instant",
        "range": {
          "_value": "0",
          "multiplyByRank": false,
          "reach": false
        },
        "cost": 0,
        "roll": {
          "hasRoll": true,
          "type": "combat",
          "ability": "agility",
          "against": "agility",
          "lifepoolTarget": "health",
          "bonus": 0,
          "edges": 0,
          "troubles": 0
        },
        "description": "<p><strong>Power Set:</strong> Ranged Weapons</p><p><strong>Prerequisites:</strong> Snap Shooting</p><p><strong>Action:</strong> Standard</p><p><strong>Duration:</strong> Instant</p><p>The character splits their attack to make two ranged attacks against separate targets (or they can focus a single attack on a single target). Make a single Agility check and compare it to the targets’ Agility defenses. On a success, the affected target takes half regular damage. On a Fantastic success, the affected target takes full damage, and the character can make a bonus attack with this power against any available target, with the same effect.</p><p><em>Core Rulebook, p. 130 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Applies half/full damage and unlocks a bonus-attack control after a Fantastic hit. The GM selects the new target.</p>"
      },
      "effects": []
    },
    "automation": "Applies half/full damage and unlocks a bonus-attack control after a Fantastic hit. The GM selects the new target.",
    "contentVersion": "0.3.0",
    "automationMode": "automated"
  },
  {
    "id": "starter:change-of-plans",
    "name": "Change of Plans",
    "type": "power",
    "sets": [
      "tactics"
    ],
    "minRank": 2,
    "requires": [
      "starter:inspiration"
    ],
    "trainingAllowed": true,
    "reviewed": true,
    "source": "Core Rulebook, p. 87 (supplied PDF).",
    "description": "Power Set: Tactics. Prerequisites: Inspiration, Rank 2. Action: Reaction. Trigger: An ally has trouble on an action check.. Duration: 1 round. Cost: 5 Focus. The ally gains an edge on that action check.",
    "item": {
      "name": "Change of Plans",
      "type": "power",
      "img": "icons/svg/lightning.svg",
      "system": {
        "powerSets": [
          "tactics"
        ],
        "actions": [
          "reaction"
        ],
        "duration": "oneRound",
        "range": {
          "_value": "0",
          "multiplyByRank": false,
          "reach": false
        },
        "cost": 5,
        "roll": {
          "hasRoll": false,
          "type": "combat",
          "ability": "agility",
          "against": "agility",
          "lifepoolTarget": "health",
          "bonus": 0,
          "edges": 0,
          "troubles": 0
        },
        "description": "<p><strong>Power Set:</strong> Tactics</p><p><strong>Prerequisites:</strong> Inspiration, Rank 2</p><p><strong>Action:</strong> Reaction</p><p><strong>Trigger:</strong> An ally has trouble on an action check.</p><p><strong>Duration:</strong> 1 round</p><p><strong>Cost:</strong> 5 Focus</p><p>The ally gains an edge on that action check.</p><p><em>Core Rulebook, p. 87 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Deducts Focus and adds an edge to an unresolved native roll with trouble, before rerolls. The GM confirms the ally and trigger.</p>"
      },
      "effects": []
    },
    "automation": "Deducts Focus and adds an edge to an unresolved native roll with trouble, before rerolls. The GM confirms the ally and trigger.",
    "contentVersion": "0.3.0",
    "automationMode": "automated"
  },
  {
    "id": "starter:combat-support",
    "name": "Combat Support",
    "type": "power",
    "sets": [
      "tactics"
    ],
    "minRank": 3,
    "requires": [
      "starter:change-of-plans"
    ],
    "trainingAllowed": true,
    "reviewed": true,
    "source": "Core Rulebook, p. 89 (supplied PDF).",
    "description": "Power Set: Tactics. Prerequisites: Change of Plans, Rank 3. Action: Standard. Duration: 1 round. Cost: 10 Focus. Once per battle, the character chooses an ally in earshot. If the ally makes an action check before the start of the character’s next turn, the ally automatically rolls a 1 on their Marvel die, and that die cannot be affected by trouble.",
    "item": {
      "name": "Combat Support",
      "type": "power",
      "img": "icons/svg/lightning.svg",
      "system": {
        "powerSets": [
          "tactics"
        ],
        "actions": [
          "standard"
        ],
        "duration": "oneRound",
        "range": {
          "_value": "0",
          "multiplyByRank": false,
          "reach": false
        },
        "cost": 10,
        "roll": {
          "hasRoll": false,
          "type": "combat",
          "ability": "agility",
          "against": "agility",
          "lifepoolTarget": "health",
          "bonus": 0,
          "edges": 0,
          "troubles": 0
        },
        "description": "<p><strong>Power Set:</strong> Tactics</p><p><strong>Prerequisites:</strong> Change of Plans, Rank 3</p><p><strong>Action:</strong> Standard</p><p><strong>Duration:</strong> 1 round</p><p><strong>Cost:</strong> 10 Focus</p><p>Once per battle, the character chooses an ally in earshot. If the ally makes an action check before the start of the character’s next turn, the ally automatically rolls a 1 on their Marvel die, and that die cannot be affected by trouble.</p><p><em>Core Rulebook, p. 89 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Requires an active combat; deducts Focus and enforces once per combat. Heroic Actions checks use the fixed special die until the source’s next turn.</p>"
      },
      "effects": []
    },
    "automation": "Requires an active combat; deducts Focus and enforces once per combat. Heroic Actions checks use the fixed special die until the source’s next turn.",
    "contentVersion": "0.3.0",
    "automationMode": "automated"
  },
  {
    "id": "starter:determination",
    "name": "Determination",
    "type": "trait",
    "sets": [],
    "reviewed": true,
    "source": "Core Rulebook, p. 60 (supplied PDF).",
    "description": " The character never gives up, even when they feel like they’re at their worst. While demoralized, they do not gain trouble on all actions, though they still cannot maintain concentration or spend further Focus.",
    "item": {
      "name": "Determination",
      "type": "trait",
      "img": "icons/svg/book.svg",
      "system": {
        "description": "<p>The character never gives up, even when they feel like they’re at their worst. While demoralized, they do not gain trouble on all actions, though they still cannot maintain concentration or spend further Focus.</p><p><em>Core Rulebook, p. 60 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Heroic Actions checks omit demoralized trouble; Focus and concentration restrictions remain.</p>"
      },
      "effects": []
    },
    "automation": "Heroic Actions checks omit demoralized trouble; Focus and concentration restrictions remain.",
    "contentVersion": "0.3.0",
    "automationMode": "contextual"
  },
  {
    "id": "starter:fearless",
    "name": "Fearless",
    "type": "trait",
    "sets": [],
    "reviewed": true,
    "source": "Core Rulebook, p. 60 (supplied PDF).",
    "description": " The character is extremely brave. They have an edge on any action checks required to deal with fear.",
    "item": {
      "name": "Fearless",
      "type": "trait",
      "img": "icons/svg/book.svg",
      "system": {
        "description": "<p>The character is extremely brave. They have an edge on any action checks required to deal with fear.</p><p><em>Core Rulebook, p. 60 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Select Fear-related check in Heroic Actions to include the edge.</p>"
      },
      "effects": []
    },
    "automation": "Select Fear-related check in Heroic Actions to include the edge.",
    "contentVersion": "0.3.0",
    "automationMode": "contextual"
  },
  {
    "id": "starter:connections-super-heroes-or-villains",
    "name": "Connections: Super Heroes or Villains",
    "type": "trait",
    "sets": [],
    "reviewed": true,
    "source": "Core Rulebook, p. 60 (supplied PDF).",
    "description": " The character knows someone with access to and knowledge of a particular field. The connection could be a reporter, a police officer, a politician, a mobster and so on. By making an Ego check, the character can call on their contact to provide help in the form of clues, information or resources. The Narrator determines the TN of the Ego check based on the favor requested.\n\nThis trait can be selected multiple times, using many different types. These include Celebrities, Community, Criminal, Espionage, Military, Outsiders, Police, Professional, Sources, Super Heroes and so on.",
    "item": {
      "name": "Connections: Super Heroes or Villains",
      "type": "trait",
      "img": "icons/svg/book.svg",
      "system": {
        "description": "<p>The character knows someone with access to and knowledge of a particular field. The connection could be a reporter, a police officer, a politician, a mobster and so on. By making an Ego check, the character can call on their contact to provide help in the form of clues, information or resources. The Narrator determines the TN of the Ego check based on the favor requested.</p><p>This trait can be selected multiple times, using many different types. These include Celebrities, Community, Criminal, Espionage, Military, Outsiders, Police, Professional, Sources, Super Heroes and so on.</p><p><em>Core Rulebook, p. 60 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Use an Ego noncombat check with a GM-set target number. The GM determines the contact’s help.</p><p>Selected field: Super Heroes or Villains. Choose a contact with the GM.</p>"
      },
      "effects": []
    },
    "automation": "Use an Ego noncombat check with a GM-set target number. The GM determines the contact’s help.",
    "contentVersion": "0.3.0",
    "automationMode": "contextual"
  },
  {
    "id": "starter:black-market-access",
    "name": "Black Market Access",
    "type": "tag",
    "sets": [],
    "reviewed": true,
    "source": "Core Rulebook, p. 63 (supplied PDF).",
    "description": " The character knows how and where they can buy and sell hard-to-find and potentially illegal things.",
    "item": {
      "name": "Black Market Access",
      "type": "tag",
      "img": "icons/svg/book.svg",
      "system": {
        "description": "<p>The character knows how and where they can buy and sell hard-to-find and potentially illegal things.</p><p><em>Core Rulebook, p. 63 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> Narrative permission; the GM determines availability and prices.</p>"
      },
      "effects": []
    },
    "automation": "Narrative permission; the GM determines availability and prices.",
    "contentVersion": "0.3.0",
    "automationMode": "contextual"
  },
  {
    "id": "starter:heroic",
    "name": "Heroic",
    "type": "tag",
    "sets": [],
    "reviewed": true,
    "source": "Core Rulebook, p. 64 (supplied PDF).",
    "description": " The character acts heroically. They help people in need, and they do their best not to kill—even with people who might deserve it.",
    "item": {
      "name": "Heroic",
      "type": "tag",
      "img": "icons/svg/book.svg",
      "system": {
        "description": "<p>The character acts heroically. They help people in need, and they do their best not to kill—even with people who might deserve it.</p><p><em>Core Rulebook, p. 64 (supplied PDF).</em></p><hr><p><strong>Heroic Actions:</strong> The GM can reset Karma to rank with the Heroic Actions rest control. Cannot also be Villainous.</p>"
      },
      "effects": []
    },
    "automation": "The GM can reset Karma to rank with the Heroic Actions rest control. Cannot also be Villainous.",
    "contentVersion": "0.3.0",
    "automationMode": "contextual"
  }
];
import {CORE,CORE_ORIGINS,CORE_OCCUPATIONS} from './core-content.js';
export const CATALOGUE=[...STARTER,...CORE].sort((a,b)=>a.name.localeCompare(b.name));
export const ORIGINS=[...CORE_ORIGINS,{id:'custom',name:'Custom / other origin (manual)',grants:[]}];
export const OCCUPATIONS=[...CORE_OCCUPATIONS,{id:'custom',name:'Custom / other occupation (manual)',grants:[]}];
export const POWER_SET_LABELS = {"basic": "Basic", "elementalControl": "Elemental Control", "illusion": "Illusion", "magic": "Magic", "martialArts": "Martial Arts", "meleeWeapons": "Melee Weapons", "omniversalTravel": "Omniversal Travel", "phasing": "Phasing", "plasticity": "Plasticity", "powerControl": "Power Control", "rangedWeapons": "Ranged Weapons", "resize": "Resize", "shieldBearer": "Shield Bearer", "spiderPowers": "Spider-Powers", "superSpeed": "Super-Speed", "superStrength": "Super-Strength", "tactics": "Tactics", "telekenesis": "Telekinesis", "telepathy": "Telepathy", "teleportation": "Teleportation", "weatherControl": "Weather Control"};
