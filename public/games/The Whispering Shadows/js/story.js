const story = {
    "start": {
        "text": "The wind howls as you stand before the towering, decayed gates of Blackwood Manor. The letter in your pocket, signed only with a 'W', feels heavy. The massive wooden doors loom ahead, shrouded in fog.",
        "image": "assets/images/mansion.png",
        "effect": "mansion-effect",
        "choices": [
            {
                "text": "Push open the front doors",
                "next": "hallway_entry"
            },
            {
                "text": "Look for a side entrance",
                "next": "side_window"
            }
        ],
        "bgm": "ambient_gloomy"
    },
    "hallway_entry": {
        "text": "The doors groan as they yield. The smell of rot is overwhelming. Dust motes dance in the light of flickering candles that shouldn't be lit. To the left is the library; straight ahead is the grand dining hall.",
        "image": "assets/images/hallway.png",
        "effect": "hallway-effect",
        "choices": [
            {
                "text": "Enter the Dining Hall",
                "next": "dining_hall"
            },
            {
                "text": "Check the Library",
                "next": "library_from_hall"
            },
            {
                "text": "Go to the Grand Staircase",
                "next": "stairs_up"
            }
        ]
    },
    "side_window": {
        "text": "You climb through a shattered window and land on a pile of molding books. You are in a vast, silent library. It feels like thousands of eyes are watching from the shelves.",
        "image": "assets/images/library.png",
        "effect": "library-effect",
        "choices": [
            {
                "text": "Search for a hidden passage",
                "next": "secret_study"
            },
            {
                "text": "Exit to the main hallway",
                "next": "hallway_entry"
            }
        ]
    },
    "library_from_hall": {
        "text": "Thousands of books line the walls. A single candle flickers on a desk, illuminating a small note and a strange lever behind a shelf.",
        "image": "assets/images/library.png",
        "effect": "library-effect",
        "choices": [
            {
                "text": "Read the note",
                "next": "discovery_note"
            },
            {
                "text": "Pull the strange lever",
                "next": "secret_study"
            },
            {
                "text": "Back to the hallway",
                "next": "hallway_entry"
            }
        ]
    },
    "discovery_note": {
        "text": "'They are in the walls,' the note reads. 'The Guardian waits in the attic. Do not enter the basement without protection.' A set of rusty keys lies under the note.",
        "image": "assets/images/library.png",
        "effect": "library-effect",
        "choices": [
            {
                "text": "Take the keys and head for the basement",
                "next": "basement_entry",
                "addItem": "Rusty Keys"
            },
            {
                "text": "Pull the strange lever",
                "next": "secret_study"
            }
        ]
    },
    "secret_study": {
        "text": "A section of the bookshelf slides away, revealing a cramped study. On the desk sits an ornate Silver Dagger and a map of the manor with the Attic circled in blood.",
        "image": "assets/images/library.png",
        "effect": "library-effect",
        "choices": [
            {
                "text": "Take the Silver Dagger",
                "next": "secret_study_done",
                "addItem": "Silver Dagger"
            },
            {
                "text": "Ignore the dagger and leave",
                "next": "hallway_entry"
            }
        ]
    },
    "secret_study_done": {
        "text": "The Silver Dagger feels surprisingly light in your hand. You feel a strange sense of confidence as you step back into the library.",
        "image": "assets/images/library.png",
        "effect": "library-effect",
        "choices": [
            {
                "text": "Return to the Hallway",
                "next": "hallway_entry"
            }
        ]
    },
    "dining_hall": {
        "text": "A long, dusty table dominates the room. As you enter, the candles suddenly flare up. A dark figure stands at the far end of the table, facing the wall.",
        "image": "assets/images/dining_hall.png",
        "effect": "mansion-effect",
        "ghostImage": "assets/images/ghost_shadow.png",
        "choices": [
            {
                "text": "Call out to the figure",
                "next": "ghost_confront_dining"
            },
            {
                "text": "Quietly slip into the Kitchen",
                "next": "kitchen"
            },
            {
                "text": "Run back to the hallway!",
                "next": "hallway_entry"
            }
        ]
    },
    "ghost_confront_dining": {
        "text": "The figure spins around with supernatural speed. It has no face—only swirling shadows. The air grows cold and your vision begins to blur.",
        "image": "assets/images/dining_hall.png",
        "choices": [
            {
                "text": "Use the Silver Dagger!",
                "next": "ghost_repelled",
                "requiredItem": "Silver Dagger"
            },
            {
                "text": "Freeze in terror",
                "next": "caught_ending"
            },
            {
                "text": "RUN!",
                "next": "hallway_entry"
            }
        ]
    },
    "ghost_repelled": {
        "text": "The Silver Dagger glows with a pale light. The shadow screams—a sound like tearing metal—and vanishes into the floorboards. You are safe, for now.",
        "image": "assets/images/dining_hall.png",
        "effect": "mansion-effect",
        "choices": [
            {
                "text": "Enter the Kitchen",
                "next": "kitchen"
            },
            {
                "text": "Return to the Hallway",
                "next": "hallway_entry"
            }
        ]
    },
    "kitchen": {
        "text": "Rusted meat hooks hang from the ceiling, swaying slightly. A single drawer is slightly open, revealing a heavy brass key.",
        "image": "assets/images/kitchen.png",
        "effect": "kitchen-effect",
        "choices": [
            {
                "text": "Take the Heavy Key",
                "next": "kitchen_done",
                "addItem": "Heavy Key"
            },
            {
                "text": "Inspect the Basement door",
                "next": "basement_entry"
            },
            {
                "text": "Back to the Dining Hall",
                "next": "dining_hall"
            }
        ]
    },
    "kitchen_done": {
        "text": "The Heavy Key is cold to the touch. It looks like it could unlock something massive.",
        "image": "assets/images/kitchen.png",
        "effect": "kitchen-effect",
        "choices": [
            {
                "text": "Go to the Basement",
                "next": "basement_entry"
            },
            {
                "text": "Back to the Dining Hall",
                "next": "dining_hall"
            }
        ]
    },
    "stairs_up": {
        "text": "The staircase moans under your weight. You reach the second floor landing. To the left is the master bedroom; a small, narrow ladder leads further up to the attic.",
        "image": "assets/images/hallway.png",
        "effect": "hallway-effect",
        "choices": [
            {
                "text": "Enter the Master Bedroom",
                "next": "master_bedroom"
            },
            {
                "text": "Climb to the Attic",
                "next": "attic_entry"
            },
            {
                "text": "Go back downstairs",
                "next": "hallway_entry"
            }
        ]
    },
    "master_bedroom": {
        "text": "A massive canopy bed sits in the center. An open diary lies on the nightstand. It belongs to your father. 'I couldn't protect them,' it reads. 'The shadows demand a host. Forgive me, my child.'",
        "image": "assets/images/bedroom.png",
        "effect": "bedroom-effect",
        "choices": [
            {
                "text": "Read more of the diary",
                "next": "twist_reveal"
            },
            {
                "text": "Check the window for an escape",
                "next": "dead_end_escape"
            },
            {
                "text": "Leave immediately",
                "next": "stairs_up"
            }
        ]
    },
    "twist_reveal": {
        "text": "The last entry is dated today. 'If you are reading this, I am already part of the manor. Do not face the Guardian in the attic without the Silver Dagger. It is the only way to break the cycle.'",
        "image": "assets/images/bedroom.png",
        "effect": "bedroom-effect",
        "choices": [
            {
                "text": "Head for the Attic",
                "next": "attic_entry"
            },
            {
                "text": "Look for the Dagger in the study first",
                "next": "hallway_entry"
            }
        ]
    },
    "attic_entry": {
        "text": "The attic is freezing. Dust motes hang frozen in the air. A massive iron door stands at the far end, locked tight. The whispering is deafening here.",
        "image": "assets/images/attic.png",
        "effect": "attic-effect",
        "choices": [
            {
                "text": "Use the Heavy Key on the iron door",
                "next": "final_confrontation",
                "requiredItem": "Heavy Key"
            },
            {
                "text": "Look for another way around",
                "next": "caught_ending"
            },
            {
                "text": "Retreat downstairs",
                "next": "stairs_up"
            }
        ]
    },
    "final_confrontation": {
        "text": "The iron door swings open. Your father—or what's left of him—is fused to a central pillar of shadow. 'Help me... or join me,' he whispers. The shadows surge forward!",
        "image": "assets/images/attic.png",
        "ghostImage": "assets/images/ghost_shadow.png",
        "choices": [
            {
                "text": "Stab the central pillar with the Silver Dagger!",
                "next": "freedom_ending",
                "requiredItem": "Silver Dagger"
            },
            {
                "text": "Surrender to the shadows",
                "next": "eternal_wait_ending"
            }
        ]
    },
    "basement_entry": {
        "text": "The iron door to the basement yields with a screech. The air here is freezing. You feel eyes on you from the darkness. There is a strange machine humming in the corner.",
        "image": "assets/images/basement.png",
        "effect": "basement-effect",
        "choices": [
            {
                "text": "Examine the humming machine",
                "next": "truth_ending"
            },
            {
                "text": "Turn back immediately!",
                "next": "caught_ending"
            }
        ]
    },
    "dead_end_escape": {
        "text": "The window is barred with iron. The manor refuses to let you go. The whispering starts again, louder this time. It calls your name.",
        "image": "assets/images/hallway.png",
        "effect": "hallway-effect",
        "choices": [
            {
                "text": "Go to the attic. There is no other way.",
                "next": "attic_entry"
            }
        ]
    },
    "caught_ending": {
        "text": "The shadows move faster than you can react. A cold, skeletal grip tightens around your throat. The last thing you see are eyes that reflect your own terror. You are now part of Blackwood Manor.",
        "image": "assets/images/game_over.png",
        "effect": "none",
        "choices": [
            {
                "text": "RESTART FROM THE GATES",
                "next": "start"
            }
        ]
    },
    "freedom_ending": {
        "text": "As the Silver Dagger pierces the shadow, the manor reality shatters. You find yourself standing outside the gates as the sun rises. The mansion is gone—only a pile of ash remains. You are free, but the whispers linger in your mind forever.",
        "image": "assets/images/mansion.png",
        "effect": "none",
        "choices": [
            {
                "text": "PLAY AGAIN",
                "next": "start"
            }
        ]
    },
    "eternal_wait_ending": {
        "text": "You accept the shadows. Your body dissolves into the darkness, and you take your father's place at the pillar. Now you wait for the next letter to be written. You are the new Guardian of Blackwood Manor.",
        "image": "assets/images/attic.png",
        "effect": "attic-effect",
        "choices": [
            {
                "text": "RESTART THE CURESE",
                "next": "start"
            }
        ]
    },
    "truth_ending": {
        "text": "The machine reveals the truth. Blackwood Manor is a living organism, feeding on memories. You realize why you came back. You weren't a victim; you were the bait. But now the machine is yours to control.",
        "image": "assets/images/basement.png",
        "effect": "none",
        "choices": [
            {
                "text": "REWRITE REALITY",
                "next": "start"
            }
        ]
    }
};
