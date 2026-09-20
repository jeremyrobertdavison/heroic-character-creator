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
    "reviewed": false,
    "source": "Starter example; prerequisites transcribed from supplied Actor export; full PDF verification pending.",
    "description": "Encourage an ally within hearing range, granting an edge on their action checks until your next turn. Standard action; one round.",
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
        "description": "<p>Encourage an ally within hearing range, granting an edge on their action checks until your next turn. Standard action; one round.</p><p><em>Creator summary. Consult the core rulebook for complete wording and exceptions. Combat effects are not automated by this module.</em></p>"
      },
      "effects": []
    }
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
    "reviewed": false,
    "source": "Starter example; prerequisites transcribed from supplied Actor export; full PDF verification pending.",
    "description": "React to an attack against your Agility defense to give the attacker trouble on that attack.",
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
        "description": "<p>React to an attack against your Agility defense to give the attacker trouble on that attack.</p><p><em>Creator summary. Consult the core rulebook for complete wording and exceptions. Combat effects are not automated by this module.</em></p>"
      },
      "effects": []
    }
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
    "reviewed": false,
    "source": "Starter example; prerequisites transcribed from supplied Actor export; full PDF verification pending.",
    "description": "Maintain an offensive stance that doubles your Melee ability contribution to damage. Requires a standard action and concentration.",
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
        "description": "<p>Maintain an offensive stance that doubles your Melee ability contribution to damage. Requires a standard action and concentration.</p><p><em>Creator summary. Consult the core rulebook for complete wording and exceptions. Combat effects are not automated by this module.</em></p>"
      },
      "effects": []
    }
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
    "reviewed": false,
    "source": "Starter example; prerequisites transcribed from supplied Actor export; full PDF verification pending.",
    "description": "While in Attack Stance, react to a damaging close attack by dealing half the attacker\u2019s regular damage back. Costs 5 Focus.",
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
        "description": "<p>While in Attack Stance, react to a damaging close attack by dealing half the attacker\u2019s regular damage back. Costs 5 Focus.</p><p><em>Creator summary. Consult the core rulebook for complete wording and exceptions. Combat effects are not automated by this module.</em></p>"
      },
      "effects": []
    }
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
    "reviewed": false,
    "source": "Starter example; prerequisites transcribed from supplied Actor export; full PDF verification pending.",
    "description": "Maintain a defensive stance that imposes trouble on close attacks until one successfully hits you. Standard action; concentration.",
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
        "description": "<p>Maintain a defensive stance that imposes trouble on close attacks until one successfully hits you. Standard action; concentration.</p><p><em>Creator summary. Consult the core rulebook for complete wording and exceptions. Combat effects are not automated by this module.</em></p>"
      },
      "effects": []
    }
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
    "reviewed": false,
    "source": "Starter example; prerequisites transcribed from supplied Actor export; full PDF verification pending.",
    "description": "Close attacks against you have trouble; Defense Stance increases that to double trouble.",
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
        "description": "<p>Close attacks against you have trouble; Defense Stance increases that to double trouble.</p><p><em>Creator summary. Consult the core rulebook for complete wording and exceptions. Combat effects are not automated by this module.</em></p>"
      },
      "effects": []
    }
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
    "reviewed": false,
    "source": "Starter example; prerequisites transcribed from supplied Actor export; full PDF verification pending.",
    "description": "Spend your standard and movement actions to shoot a target at least 20 spaces away. Costs 5 Focus; a Fantastic success increases damage. Consult the full power for resolution.",
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
        "description": "<p>Spend your standard and movement actions to shoot a target at least 20 spaces away. Costs 5 Focus; a Fantastic success increases damage. Consult the full power for resolution.</p><p><em>Creator summary. Consult the core rulebook for complete wording and exceptions. Combat effects are not automated by this module.</em></p>"
      },
      "effects": []
    }
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
    "reviewed": false,
    "source": "Starter example; prerequisites transcribed from supplied Actor export; full PDF verification pending.",
    "description": "Use one Agility check for a split ranged attack against up to two targets. Damage and Fantastic effects require manual resolution; consult the full power.",
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
        "description": "<p>Use one Agility check for a split ranged attack against up to two targets. Damage and Fantastic effects require manual resolution; consult the full power.</p><p><em>Creator summary. Consult the core rulebook for complete wording and exceptions. Combat effects are not automated by this module.</em></p>"
      },
      "effects": []
    }
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
    "reviewed": false,
    "source": "Starter example; prerequisites transcribed from supplied Actor export; full PDF verification pending.",
    "description": "A split ranged attack whose Fantastic result can grant an additional attack. Resolve target selection, damage and follow-up attacks manually.",
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
        "description": "<p>A split ranged attack whose Fantastic result can grant an additional attack. Resolve target selection, damage and follow-up attacks manually.</p><p><em>Creator summary. Consult the core rulebook for complete wording and exceptions. Combat effects are not automated by this module.</em></p>"
      },
      "effects": []
    }
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
    "reviewed": false,
    "source": "Starter example; prerequisites transcribed from supplied Actor export; full PDF verification pending.",
    "description": "React when an ally has trouble on an action check to grant them an edge. Costs 5 Focus.",
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
        "description": "<p>React when an ally has trouble on an action check to grant them an edge. Costs 5 Focus.</p><p><em>Creator summary. Consult the core rulebook for complete wording and exceptions. Combat effects are not automated by this module.</em></p>"
      },
      "effects": []
    }
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
    "reviewed": false,
    "source": "Starter example; prerequisites transcribed from supplied Actor export; full PDF verification pending.",
    "description": "Once per battle, spend 10 Focus and a standard action to help an ally in earshot control their next special die result. Consult the full power for timing and restrictions.",
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
        "description": "<p>Once per battle, spend 10 Focus and a standard action to help an ally in earshot control their next special die result. Consult the full power for timing and restrictions.</p><p><em>Creator summary. Consult the core rulebook for complete wording and exceptions. Combat effects are not automated by this module.</em></p>"
      },
      "effects": []
    }
  },
  {
    "id": "starter:determination",
    "name": "Determination",
    "type": "trait",
    "sets": [],
    "reviewed": false,
    "source": "Core Rulebook; starter summary, full option audit pending.",
    "description": "Being demoralized does not impose the usual trouble on your actions. Other demoralized restrictions still apply.",
    "item": {
      "name": "Determination",
      "type": "trait",
      "img": "icons/svg/book.svg",
      "system": {
        "description": "<p>Being demoralized does not impose the usual trouble on your actions. Other demoralized restrictions still apply.</p>"
      },
      "effects": []
    }
  },
  {
    "id": "starter:fearless",
    "name": "Fearless",
    "type": "trait",
    "sets": [],
    "reviewed": false,
    "source": "Core Rulebook; starter summary, full option audit pending.",
    "description": "Occupational trait granted by Adventurer. Consult the core rulebook for its mechanical effect.",
    "item": {
      "name": "Fearless",
      "type": "trait",
      "img": "icons/svg/book.svg",
      "system": {
        "description": "<p>Occupational trait granted by Adventurer. Consult the core rulebook for its mechanical effect.</p>"
      },
      "effects": []
    }
  },
  {
    "id": "starter:connections-super-heroes-or-villains",
    "name": "Connections: Super Heroes or Villains",
    "type": "trait",
    "sets": [],
    "reviewed": false,
    "source": "Core Rulebook; starter summary, full option audit pending.",
    "description": "A contact in the super hero or villain community. Choose the contact with the Narrator and consult the Connections trait.",
    "item": {
      "name": "Connections: Super Heroes or Villains",
      "type": "trait",
      "img": "icons/svg/book.svg",
      "system": {
        "description": "<p>A contact in the super hero or villain community. Choose the contact with the Narrator and consult the Connections trait.</p>"
      },
      "effects": []
    }
  },
  {
    "id": "starter:black-market-access",
    "name": "Black Market Access",
    "type": "tag",
    "sets": [],
    "reviewed": false,
    "source": "Core Rulebook; starter summary, full option audit pending.",
    "description": "Backstory tag indicating access to illicit markets.",
    "item": {
      "name": "Black Market Access",
      "type": "tag",
      "img": "icons/svg/book.svg",
      "system": {
        "description": "<p>Backstory tag indicating access to illicit markets.</p>"
      },
      "effects": []
    }
  },
  {
    "id": "starter:heroic",
    "name": "Heroic",
    "type": "tag",
    "sets": [],
    "reviewed": false,
    "source": "Core Rulebook; starter summary, full option audit pending.",
    "description": "Backstory tag identifying a heroic character.",
    "item": {
      "name": "Heroic",
      "type": "tag",
      "img": "icons/svg/book.svg",
      "system": {
        "description": "<p>Backstory tag identifying a heroic character.</p>"
      },
      "effects": []
    }
  }
];
export const ORIGINS = [{"id": "special-training", "name": "Special Training", "grants": ["starter:determination"], "source": "Core p. 56"}, {"id": "custom", "name": "Custom / other origin (manual)", "grants": []}];
export const OCCUPATIONS = [{"id": "adventurer", "name": "Adventurer", "grants": ["starter:fearless", "starter:connections-super-heroes-or-villains", "starter:black-market-access"], "source": "Core p. 57"}, {"id": "custom", "name": "Custom / other occupation (manual)", "grants": []}];
