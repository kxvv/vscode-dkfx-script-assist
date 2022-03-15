import { DkEntity } from "./model/DkEntity";
import { ParamType } from "./model/ParamType";

export const DK_ENTITIES: { [key: string]: DkEntity[] } = {
    [ParamType.Player]: [
        { val: "PLAYER0", doc: "The RED player", keeper: true },
        { val: "PLAYER1", doc: "The BLUE player", keeper: true },
        { val: "PLAYER2", doc: "The GREEN player", keeper: true },
        { val: "PLAYER3", doc: "The YELLOW player", keeper: true },
        { val: "RED", doc: "PLAYER0's equivalent", keeper: true },
        { val: "BLUE", doc: "PLAYER1's equivalent", keeper: true },
        { val: "GREEN", doc: "PLAYER2's equivalent", keeper: true },
        { val: "YELLOW", doc: "PLAYER3's equivalent", keeper: true },
        { val: "WHITE", doc: "Heroes/PLAYER_GOOD's equivalent" },
        { val: "PLAYER_GOOD", doc: "The heroes" },
        { val: "ALL_PLAYERS" },
        { val: "PLAYER_NEUTRAL", doc: "The neutral player" },
    ],
    [ParamType.PlayerGood]: [
        { val: "PLAYER_GOOD", doc: "The heroes" },
        { val: "WHITE", doc: "Heroes/PLAYER_GOOD's equivalent" },
    ],
    [ParamType.Timer]: new Array(8).fill(0).map((e, i) => ({
        val: "TIMER" + i,
        doc: `The timer number ${i}. Each player has their own timer sets.`
    })),
    [ParamType.Flag]: new Array(8).fill(0).map((e, i) => ({
        val: "FLAG" + i,
        doc: `The flag number ${i}. Each player has their own flag sets.`
    })),
    [ParamType.CampaignFlag]: new Array(8).fill(0).map((e, i) => ({
        val: "CAMPAIGN_FLAG" + i,
        doc: `Campaign flag number ${i}. Each player has their own flag sets. Values set to campaign flags can be used throughout the campaign in future levels.`
    })),
    [ParamType.Computer]: [
        {
            val: "0",
            doc: "A general computer player with everything turned on. Builds rooms quickly and is aggressive.",
        },
        {
            val: "1",
            doc: "Medium aggressive computer player. Builds rooms slowly.",
        },
        {
            val: "2",
            doc: "Medium defensive computer player.",
        },
        {
            val: "3",
            doc: "A defensive computer player that only builds rooms 3x3 tiles in size.",
        },
        {
            val: "4",
            doc: "A defensive computer player that only builds rooms 4x4 tiles in size.",
        },
        {
            val: "5",
            doc: "An aggressive computer player that only builds rooms 4x4 tiles in size.",
        },
        {
            val: "6",
            doc: "General aggressive computer player.",
        },
        {
            val: "7",
            doc: "General defensive computer player.",
        },
        {
            val: "8",
            doc: "Constructive defensive player that builds 5x5 rooms. Doesn't dig for gold, doesn't move creatures.",
        },
        {
            val: "9",
            doc: "A computer player which only moves creatures.",
        },
        {
            val: "10",
            doc: "A medium computer player.",
        },
        {
            val: "11",
            doc: "Build and defend Computer.",
        },
        {
            val: "12",
            doc: "Rapid Gold Digging Computer With Imp Army.",
        },
        {
            val: "13",
            doc: "Skirmish Defensive",
        },
        {
            val: "14",
            doc: "Skirmish Peculiar",
        },
        {
            val: "15",
            doc: "Skirmish Balanced",
        },
        {
            val: "16",
            doc: "Skirmish Rush",
        },
    ],
    [ParamType.Creature]: [
        ..."WIZARD,TUNNELLER,BARBARIAN,ARCHER,MONK,KNIGHT,AVATAR,GIANT,FAIRY,THIEF,SAMURAI,IMP,HORNY,SKELETON,TROLL,DRAGON,DEMONSPAWN,FLY,DARK_MISTRESS,BILE_DEMON,VAMPIRE,SPIDER,HELL_HOUND,GHOST,TENTACLE,ORC"
            .split(",").sort().map(v => ({ val: v })),
        {
            val: "DWARFA",
            doc: "Known as Mountain Dwarf ingame."
        },
        {
            val: "WITCH",
            doc: "Known as Priestess ingame."
        },
        {
            val: "SORCEROR",
            doc: "Known as Warlocks ingame."
        },
        {
            val: "BUG",
            doc: "Known as Beetles ingame."
        },
        {
            val: "FLOATING_SPIRIT",
            doc: "Is not a proper game creature, only use when you know what you're doing."
        },
    ],
    [ParamType.Room]: [
        ..."TREASURE,PRISON,TORTURE,TRAINING,WORKSHOP,SCAVENGER,TEMPLE,GRAVEYARD,BARRACKS,LAIR,BRIDGE,GUARD_POST"
            .split(",").sort().map(v => ({ val: v })),
        {
            val: "ENTRANCE",
            doc: "A portal."
        },
        {
            val: "RESEARCH",
            doc: "A library."
        },
        {
            val: "GARDEN",
            doc: "A hatchery."
        },
    ],
    [ParamType.Power]: [
        ..."POWER_IMP,POWER_OBEY,POWER_SIGHT,POWER_CALL_TO_ARMS,POWER_CAVE_IN,POWER_HEAL_CREATURE,POWER_HOLD_AUDIENCE,POWER_LIGHTNING,POWER_SPEED,POWER_PROTECT,POWER_CONCEAL,POWER_DISEASE,POWER_CHICKEN,POWER_DESTROY_WALLS,POWER_ARMAGEDDON"
            .split(",").sort().map(v => ({ val: v })),
        {
            val: "POWER_POSSESS",
            doc: "Available to every keeper automatically."
        },
        {
            val: "POWER_HAND",
            doc: "Available to every keeper automatically."
        },
        {
            val: "POWER_SLAP",
            doc: "Available to every keeper automatically."
        },
        {
            val: "POWER_TIME_BOMB",
            doc: "Unreleased dungeon keeper spell."
        },
    ],
    [ParamType.Door]: [
        ..."WOOD,BRACED,STEEL,MAGIC"
            .split(",").sort().map(v => ({ val: v })),
    ],
    [ParamType.Trap]: [
        ..."BOULDER,ALARM,POISON_GAS,LIGHTNING,WORD_OF_POWER,LAVA"
            .split(",").sort().map(v => ({ val: v })),
    ],
    [ParamType.Global]: [
        {
            val: "MONEY",
            doc: "The amount of money the player has",
        },
        {
            val: "GAME_TURN",
            doc: "The current game turn (player independent)",
        },
        {
            val: "HEART_HEALTH",
            doc: "The amount of health the dungeon heart of the player has",
        },
        {
            val: "TOTAL_DIGGERS",
            doc: "The number of special diggers (Imps) that player has got",
            creature: true
        },
        {
            val: "TOTAL_CREATURES",
            doc: "The number of creatures that player has got",
            creature: true
        },
        {
            val: "EVIL_CREATURES",
            doc: "The number of evil creatures that player has got",
            creature: true
        },
        {
            val: "GOOD_CREATURES",
            doc: "The number of heroes that player has got",
            creature: true
        },
        {
            val: "TOTAL_RESEARCH",
            doc: "The amount of research points that player has got (see manipulating research section for more information)",
        },
        {
            val: "TOTAL_DOORS",
            doc: "The amount of doors that player has got",
        },
        {
            val: "TOTAL_DOORS_MANUFACTURED",
            doc: "The amount of doors the player created in the workshop",
        },
        {
            val: "TOTAL_DOORS_USED",
            doc: "The amount of doors the player placed on the map",
        },
        {
            val: "TOTAL_TRAPS_MANUFACTURED",
            doc: "The amount of traps the player created in the workshop",
        },
        {
            val: "TOTAL_TRAPS_USED",
            doc: "The amount of traps the player placed on the map",
        },
        {
            val: "TOTAL_MANUFACTURED",
            doc: "The amount of traps and doors the player created in the workshop",
        },
        {
            val: "TOTAL_AREA",
            doc: "The amount of tiles that player owns",
        },
        {
            val: "TOTAL_CREATURES_LEFT",
            doc: "The amount of creatures that have left that player's dungeon because they were annoyed",
        },
        {
            val: "TOTAL_SALARY",
            doc: "The amount of salary the player has payed up to this point",
        },
        {
            val: "CURRENT_SALARY",
            doc: "The current estimated amount of the players next payday",
        },
        {
            val: "CREATURES_ANNOYED",
            doc: "The number of creatures annoyed in that player's dungeon",
        },
        {
            val: "TIMES_ANNOYED_CREATURE",
            doc: "The number of times player did something a creature disliked",
        },
        {
            val: "TIMES_TORTURED_CREATURE",
            doc: "The number of times player placed any creature in torture room",
        },
        {
            val: "TIMES_LEVELUP_CREATURE",
            doc: "The number of times a creature gained a level in the training room",
        },
        {
            val: "BATTLES_WON",
            doc: "The number of battles won by that player",
        },
        {
            val: "BATTLES_LOST",
            doc: "The number of battles lost by that player",
        },
        {
            val: "ROOMS_DESTROYED",
            doc: "The number of rooms belonging to the player which were sold or destroyed",
        },
        {
            val: "SPELLS_STOLEN",
            doc: "The number of spells stolen from that player",
        },
        {
            val: "TIMES_BROKEN_INTO",
            doc: "The number of times that players walls have been breached",
        },
        {
            val: "DUNGEON_DESTROYED",
            doc: "Whether that players Dungeon Heart has been destroyed (0 if still active, 1 if destroyed)",
        },
        {
            val: "CREATURES_SCAVENGED_LOST",
            doc: "Number of creatures lost by that player due to scavenging",
        },
        {
            val: "CREATURES_SCAVENGED_GAINED",
            doc: "Number of creatures gained by that player through scavenging",
        },
        {
            val: "CREATURES_SACRIFICED",
            doc: "Number of creatures sacrificed in the temple",
        },
        {
            val: "CREATURES_FROM_SACRIFICE",
            doc: "Number of creatures gained by the player through the temple",
        },
        {
            val: "CREATURES_CONVERTED",
            doc: "Number of creatures gained by the player through converting in the torture room",
        },
        {
            val: "ALL_DUNGEONS_DESTROYED",
            doc: "Whether all the players Dungeon Hearts has been destroyed (0 if still active, 1 if destroyed) (player independent)",
        },
        {
            val: "KEEPERS_DESTROYED",
            doc: "The amount of dungeon hearts destroyed by this player",
        },
        {
            val: "DOORS_DESTROYED",
            doc: "The number of doors belonging to the player which were sold or destroyed",
        },
        {
            val: "TOTAL_GOLD_MINED",
            doc: "Total amount of gold mined by the player",
        },
        {
            val: "GOLD_POTS_STOLEN",
            doc: "Number of gold pots that were stolen from the player",
        },
        {
            val: "BREAK_IN",
            doc: "Amount of break-ins",
        },
        {
            val: "GHOSTS_RAISED",
            doc: "Number of Ghosts created in torture room",
        },
        {
            val: "SKELETONS_RAISED",
            doc: "Number of Skeletons created in prison",
        },
        {
            val: "VAMPIRES_RAISED",
            doc: "Number of Skeletons created in graveyard",
        },
        {
            val: "BONUS_TIME",
            doc: "The current value of the BONUS_LEVEL_TIME timer",
        },
        {
            val: "DOORS_SOLD",
            doc: "How many doors the player sold",
        },
        {
            val: "EVIL_CREATURES_CONVERTED",
            doc: "Number of creatures gained by the player through converting in the torture room, excluding heroes and imps",
        },
        {
            val: "GOOD_CREATURES_CONVERTED",
            doc: "Number of heroes gained by the player through converting in the torture room",
        },
        {
            val: "MANUFACTURE_GOLD",
            doc: "How much gold the player gained through selling traps and doors",
        },
        {
            val: "MANUFACTURED_SOLD",
            doc: "How many traps and doors the player sold",
        },
        {
            val: "TOTAL_SCORE",
            doc: "The level score, based on quality of the dungeon and number of creatures",
        },
        {
            val: "TRAPS_SOLD",
            doc: "How many traps the player sold",
        },
    ],
    [ParamType.Objective]: [
        {
            val: "STEAL_GOLD",
            doc: "Steal gold from the Treasure Room until unit carries 1000 gold.",
        },
        {
            val: "STEAL_SPELLS",
            doc: "Go to Library and steal one spell book.",
        },
        {
            val: "ATTACK_ENEMIES",
            doc: "Attack any enemies.",
        },
        {
            val: "ATTACK_ROOMS",
            doc: "Attack the nearest rooms.",
        },
        {
            val: "ATTACK_DUNGEON_HEART",
            doc: "Attack the nearest Dungeon Heart.",
        },
        {
            val: "DEFEND_HEART",
            doc: "Go to own heart and defend it until destroyed.",
        },
        {
            val: "DEFEND_LOCATION",
            doc: "Never do any objective.",
        },
        {
            val: "DEFEND_PARTY",
            doc: "Will not do any objective so will not assume party leadership.",
        },
        {
            val: "DEFEND_ROOMS",
            doc: "Defend nearest owned room, not counting portals, hearts or bridges.",
        },
    ],
    [ParamType.HeadFor]: [
        {
            val: "ACTION_POINT",
            doc: "An Action Point",
        },
        {
            val: "DUNGEON",
            doc: "A Player's dungeon",
        },
        {
            val: "DUNGEON_HEART",
            doc: "A Player's Dungeon Heart"
        },
        {
            val: "APPROPIATE_DUNGEON",
            doc: "The dungeon of the player with the highest score"
        }
    ],
    [ParamType.Lvl]: new Array(10).fill(0).map((e, i) => ({ val: `${i + 1}` })),
    [ParamType.Button]: [
        { val: "0", doc: "Clear any flashing elements", },
        { val: "1", doc: "Information panel", },
        { val: "2", doc: "Rooms panel", },
        { val: "3", doc: "Spells panel", },
        { val: "4", doc: "Workshop panel", },
        { val: "5", doc: "Creatures panel", },
        { val: "6", doc: "Treasure room", },
        { val: "7", doc: "Hatchery", },
        { val: "8", doc: "Lair", },
        { val: "9", doc: "Library", },
        { val: "10", doc: "Training room", },
        { val: "11", doc: "Prison", },
        { val: "12", doc: "Temple", },
        { val: "13", doc: "Workshop", },
        { val: "14", doc: "Scavenger", },
        { val: "15", doc: "Graveyard", },
        { val: "16", doc: "Barracks", },
        { val: "17", doc: "Torture chamber", },
        { val: "18", doc: "Bridge", },
        { val: "19", doc: "Guard post", },
        { val: "20", doc: "Sell button", },
        { val: "21", doc: "Create imp", },
        { val: "22", doc: "Sight of Evil", },
        { val: "23", doc: "Call to Arms", },
        { val: "24", doc: "Cave in", },
        { val: "25", doc: "Lightning spell", },
        { val: "26", doc: "Heal spell", },
        { val: "27", doc: "Speed monster spell", },
        { val: "28", doc: "Protect spell", },
        { val: "29", doc: "Invisibility spell", },
        { val: "30", doc: "Chicken spell", },
        { val: "31", doc: "Disease spell", },
        { val: "32", doc: "Destroy walls", },
        { val: "33", doc: "Armageddon spell", },
        { val: "34", doc: "Hold audience spell", },
        { val: "35", doc: "Must obey spell", },
        { val: "36", doc: "Possess creature", },
        { val: "37", doc: "View map", },
        { val: "38", doc: "Map zoom in", },
        { val: "39", doc: "Map zoom out", },
        { val: "40", doc: "Information area 1", },
        { val: "41", doc: "Information area 2", },
        { val: "42", doc: "Information area 3", },
        { val: "43", doc: "Information area 4", },
        { val: "44", doc: "Information area 5", },
        { val: "45", doc: "Information area 6", },
        { val: "46", doc: "Information area 7", },
        { val: "47", doc: "Information area 8", },
        { val: "48", doc: "Information area 9", },
        { val: "49", doc: "Information area 10", },
        { val: "50", doc: "Information area 11", },
        { val: "51", doc: "Information area 12", },
        { val: "52", doc: "Information area 13", },
        { val: "53", doc: "Boulder trap", },
        { val: "54", doc: "Alarm trap", },
        { val: "55", doc: "Poison Gas trap", },
        { val: "56", doc: "Lightning trap", },
        { val: "57", doc: "Word of Power trap", },
        { val: "58", doc: "Wooden door", },
        { val: "59", doc: "Braced door", },
        { val: "60", doc: "Iron door", },
        { val: "61", doc: "Magic door", },
        { val: "63", doc: "Focus on area", },
        { val: "64", doc: "Close window", },
        { val: "65", doc: "Scroll up", },
        { val: "66", doc: "Scroll down", },
        { val: "67", doc: "Lava trap", },
        { val: "69", doc: "Imprisonment", },
        { val: "70", doc: "Avoid combat", },
        { val: "72", doc: "Creature idle", },
        { val: "73", doc: "Creature work", },
        { val: "74", doc: "Creature combat", },
    ],
    [ParamType.AnyCreature]: [
        {
            val: "ANY_CREATURE",
            doc: "Script commands that use the creature parameter to target a specific creature type, may use ANY_CREATURE to select a random creature type.",
        },
    ],
    [ParamType.Binary]: [
        {
            val: "0",
            doc: "false or disable",
        },
        {
            val: "1",
            doc: "true or enable",
        }
    ],
    [ParamType.Zero]: [
        {
            val: "0",
        },
    ],
    [ParamType.KeeperIndex]: [
        {
            val: "0",
            doc: "The red player - PLAYER0",
        },
        {
            val: "1",
            doc: "The blue player - PLAYER1",
        },
        {
            val: "2",
            doc: "The green player - PLAYER2",
        },
        {
            val: "3",
            doc: "The yellow player - PLAYER3",
        },
    ],
    [ParamType.RoomAvailability]: [
        {
            val: "0",
            doc: "The room will not be available."
        },
        {
            val: "1",
            doc: "The room becomes available through research."
        },
        {
            val: "2",
            doc: "The room becomes available when researched or when found on the map."
        },
        {
            val: "3",
            doc: "The room may not be researched but becomes available when claimed on the map."
        },
        {
            val: "4",
            doc: "The room becomes available for research after claimed on the map."
        },
    ],
    [ParamType.Criterion]: [
        {
            val: "MOST_EXPERIENCED",
            doc: "Highest level creature",
        },
        {
            val: "MOST_EXP_WANDERING",
            doc: "Highest level idle creature",
        },
        {
            val: "MOST_EXP_WORKING",
            doc: "Highest level working creature",
        },
        {
            val: "MOST_EXP_FIGHTING",
            doc: "Highest level creature in combat",
        },
        {
            val: "LEAST_EXPERIENCED",
            doc: "Lowest level creature",
        },
        {
            val: "LEAST_EXP_WANDERING",
            doc: "Lowest level idle creature",
        },
        {
            val: "LEAST_EXP_WORKING",
            doc: "Lowest level working creature",
        },
        {
            val: "LEAST_EXP_FIGHTING",
            doc: "Lowest level creature in combat",
        },
        {
            val: "NEAR_OWN_HEART",
            doc: "Creature close to friendly dungeon heart",
        },
        {
            val: "NEAR_ENEMY_HEART",
            doc: "Creature close to enemy dungeon heart",
        },
        {
            val: "ON_ENEMY_GROUND",
            doc: "Creature on enemy tile",
        },
        {
            val: "ON_FRIENDLY_GROUND",
            doc: "Creature on friendly tile",
        },
        {
            val: "ON_NEUTRAL_GROUND",
            doc: "Creature on neutral tile",
        },
        {
            val: "ANYWHERE",
            doc: "Creature anywhere on the level",
        },
    ],
    [ParamType.AudioType]: [
        {
            val: "SOUND"
        },
        {
            val: "SPEECH"
        },
    ],
    [ParamType.CreatureProperty]: [
        {
            val: "BLEEDS",
            doc: "the creature leaves blood when is hit, slapped, dying or being injured in any way",
        },
        {
            val: "UNAFFECTED_BY_WIND",
            doc: "the creature isn't pushed back by Wind spell",
        },
        {
            val: "IMMUNE_TO_GAS",
            doc: "the creature isn't injured by Gas Traps and Farts",
        },
        {
            val: "HUMANOID_SKELETON",
            doc: "the creature leaves a skeleton if left in prison to die",
        },
        {
            val: "PISS_ON_DEAD",
            doc: "creature feels urge to piss on nearby dead bodies",
        },
        {
            val: "FLYING",
            doc: "creature normally isn't touching ground when moving and can move up and down",
        },
        {
            val: "SEE_INVISIBLE",
            doc: "creature has natural ability which works like Sight spell",
        },
        {
            val: "PASS_LOCKED_DOORS",
            doc: "creature can move through locked doors and won't fight with doors",
        },
        {
            val: "SPECIAL_DIGGER",
            doc: "creature can dig and perform other dungeon tasks",
        },
        {
            val: "ARACHNID",
            doc: "creature is kind of spider",
        },
        {
            val: "DIPTERA",
            doc: "creature is kind of fly",
        },
        {
            val: "LORD",
            doc: `creature is lord of the land, usually arrives to level as final boss, and at arrival you can hear "beware, the lord of the land approaches"`,
        },
        {
            val: "SPECTATOR",
            doc: "creature is just a spectator for multiplayer games",
        },
        {
            val: "EVIL",
            doc: "creature has evil nature",
        },
        {
            val: "NEVER_CHICKENS",
            doc: "creature isn't affected by Chicken spell",
        },
        {
            val: "IMMUNE_TO_BOULDER",
            doc: "when boulder trap hits the creature, falls apart without dealing any damage",
        },
        {
            val: "NO_CORPSE_ROTTING",
            doc: "Creature body can't be taken to rot on graveyard",
        },
        {
            val: "NO_ENMHEART_ATTCK",
            doc: "Creature won't attack enemy dungeon heart on sight",
        },
        {
            val: "TREMBLING_FAT",
            doc: "Creature is so fat that ground trembles when it falls",
        },
        {
            val: "FEMALE",
            doc: "Creature is a female, does female sounds and has female name",
        },
        {
            val: "INSECT",
            doc: "Creature is an insect (note that DIPTERA and ARACHNID creatures should also have INSECT set explicitly)",
        },
        {
            val: "ONE_OF_KIND",
            doc: "Only one creature of that kind may exist on a specific map. Creature name is set to kind name.",
        },
        {
            val: "NO_IMPRISONMENT",
            doc: "Creature cannot be stunned for prison.",
        },
        {
            val: "IMMUNE_TO_DISEASE",
            doc: "Creature cannot get diseased.",
        },
        {
            val: "ILLUMINATED",
            doc: "A bright light will shine from the Creature.",
        },
        {
            val: "ALLURING_SCVNGR",
            doc: "When scavenging will give the keeper a portal boost compared to rival keepers.",
        },
    ],
    [ParamType.CreatureTendency]: [
        {
            val: "FLEE"
        },
        {
            val: "IMPRISON"
        },
    ],
    [ParamType.CreatureConfig]: [
        { val: "NameTextID" },
        { val: "Health" },
        { val: "HealRequirement" },
        { val: "HealThreshold" },
        { val: "Strength" },
        { val: "Armour" },
        { val: "Dexterity" },
        { val: "FearWounded" },
        { val: "FearStronger" },
        { val: "Defence" },
        { val: "Luck" },
        { val: "Recovery" },
        { val: "HungerRate" },
        { val: "HungerFill" },
        { val: "LairSize" },
        { val: "HurtByLava" },
        { val: "BaseSpeed" },
        { val: "GoldHold" },
        { val: "Size" },
        { val: "AttackPreference" },
        { val: "Pay" },
        { val: "HeroVsKeeperCost" },
        { val: "SlapsToKill" },
        { val: "CreatureLoyalty" },
        { val: "LoyaltyLevel" },
        { val: "DamageToBoulder" },
        { val: "ThingSize" },
        { val: "Properties" },
    ],
    [ParamType.GameRule]: [
        {
            val: "BodiesForVampire",
            doc: "Number of bodies the graveyard needs to create a vampire",
        },
        {
            val: "PrisonSkeletonChance",
            doc: "The chance that a dying humanoid in prison creates a skeleton",
        },
        {
            val: "GhostConvertChance",
            doc: "The chance that a creature dying from torture creates a ghost",
        },
        {
            val: "TortureDeathChance",
            doc: "The chance a victim broken from torture dies",
        },
        {
            val: "TortureConvertChance",
            doc: "The chance that a victim that survives being broken, is converted",
        },
        {
            val: "FoodGenerationSpeed",
            doc: "The speed at which the hatchery produces chickens",
        },
        {
            val: "StunEvilEnemyChance",
            doc: "The chance to stun a hero when imprisonment is on",
        },
        {
            val: "StunGoodEnemyChance",
            doc: "The chance to stun a creature when imprisonment is on",
        },
        {
            val: "BodyRemainsFor",
            doc: "Time before a body disappears and cannot be used for vampires anymore",
        },
        {
            val: "FightHateKillValue",
            doc: "How much an enemy will hate you for killing a unit. Negative values for love",
        },
        {
            val: "DungeonHeartHealth",
            doc: "The max health of a heart. Cannot exceed the short game limit of 32767",
        },
        {
            val: "DungeonHeartHealHealth",
            doc: "How much health dungeon hearts will heal (or lose) per 8 game turns",
        },
        {
            val: "PreserveClassicBugs",
            doc: "Re-enable bugs long fixed in KeeperFX. Useful for old maps",
        },
        {
            val: "ImpWorkExperience",
            doc: "Sets experience gain for doing worker tasks",
        },
        {
            val: "GemEffectiveness",
            doc: "Sets the percentage speed of mining gems instead of gold",
        },
        {
            val: "RoomSellGoldBackPercent",
            doc: "The percentage of the room price you get back when you sell it",
        },
        {
            val: "PayDayGap",
            doc: "Game turns between pay days, normally this is 10000 turns, so 500 seconds",
        },
        {
            val: "PayDaySpeed",
            doc: "The normal speed is 100%, set it to 200 to get twice as much time between pay days",
        },
        {
            val: "PayDayProgress",
            doc: "Sets how far along you are to payday",
        },
        {
            val: "DoorSellValuePercent",
            doc: "The percentage of gold the player gets for selling doors",
        },
        {
            val: "TrapSellValuePercent",
            doc: "The percentage of gold the player gets for selling traps",
        },
    ],
    [ParamType.TrapTriggerType]: [
        {
            val: "1",
            doc: "Line of sight 90 degrees"
        },
        {
            val: "2",
            doc: "Pressure activated"
        },
        {
            val: "3",
            doc: "Line of sight"
        },
    ],
    [ParamType.Operation]: [
        { val: "SET" },
        { val: "INCREASE" },
        { val: "DECREASE" },
        { val: "MULTIPLY" },
    ],
    [ParamType.TrapActivationType]: [
        { val: "1", doc: "Trap shot head for target", },
        { val: "2", doc: "Trap effect", },
        { val: "3", doc: "Trap shot stay on trap", },
        { val: "4", doc: "Change the slab into another slab type", },
        { val: "5", doc: "Shoot like a creature would", },
        { val: "6", doc: "Spawns a unit", },
        { val: "7", doc: "Keeper spell", },
    ],
    [ParamType.DisplayVarTargetType]: [
        {
            doc: "Displays how much more you need to reach the target",
            val: "0",
        },
        {
            doc: "Displays how many you need to lose to reach the target",
            val: "1",
        },
        {
            doc: "Displays how much more you need to reach the target, also displays negative values",
            val: "2",
        },
    ],
    [ParamType.DoorConfig]: [
        {
            doc: "Name is the item identifier which should be used in level script",
            val: "Name",
        },
        {
            doc: "Language-specific name of the item, as index in translation strings file",
            val: "NameTextID",
        },
        {
            doc: "Language-specific description of the item, shown as tooltip",
            val: "TooltipTextID",
        },
        {
            doc: "Sprite with big size and medium size icon of the item",
            val: "SymbolSprites",
        },
        {
            doc: "Sprite for mouse, used when placing the item",
            val: "PointerSprites",
        },
        {
            doc: "Position of the item in manufacture panel; 0 - not there, 1-15 - place in 4x4 grid",
            val: "PanelTabIndex",
        },
        {
            doc: "Crate object model which stores this item before it's deployed",
            val: "Crate",
        },
        {
            doc: "Manufacturing parameters",
            val: "ManufactureLevel",
        },
        {
            doc: "Manufacturing parameters",
            val: "ManufactureRequired",
        },
        {
            doc: "Gold revenue when selling this item",
            val: "SellingValue",
        },
        {
            doc: "Amount of hit points the item have",
            val: "Health",
        },
    ],
    [ParamType.ObjectConfig]: [
        {
            val: "Name",
        },
        {
            val: "Genre",
        },
        {
            val: "AnimationID",
        },
        {
            val: "AnimationSpeed",
        },
        {
            val: "Size_XY ",
        },
        {
            val: "Size_YZ",
        },
        {
            val: "MaximumSize",
        },
        {
            val: "DestroyOnLava",
        },
        {
            val: "DestroyOnLiquid",
        },
        {
            val: "Health",
        },
        {
            val: "FallAcceleration",
        },
        {
            val: "LightUnaffected",
        },
        {
            val: "Properties",
        },
    ],
    [ParamType.TrapConfig]: [
        { val: "NameTextID" },
        { val: "TooltipTextID" },
        { val: "SymbolSprites" },
        { val: "PointerSprites" },
        { val: "PanelTabIndex" },
        { val: "Crate" },
        { val: "ManufactureLevel" },
        { val: "ManufactureRequired" },
        { val: "Shots" },
        { val: "TimeBetweenShots" },
        { val: "SellingValue" },
        { val: "Model" },
        { val: "ModelSize" },
        { val: "AnimationSpeed" },
        { val: "TriggerType" },
        { val: "ActivationType" },
        { val: "EffectType" },
        { val: "Hidden" },
        { val: "TriggerAlarm" },
        { val: "Slappable" },
        { val: "Unanimated" },
    ],
    [ParamType.PowerLvl]: new Array(9).fill(0).map((e, i) => ({
        val: `${i + 1}`
    })),
    [ParamType.Spell]: [
        { val: "Freeze", },
        { val: "Armour", },
        { val: "Rebound", },
        { val: "Heal", },
        { val: "Invisibility", },
        { val: "Teleport", },
        { val: "Speed", },
        { val: "Slow", },
        { val: "Fly", },
        { val: "Sight", },
        { val: "Light", },
        { val: "Disease", },
        { val: "Chicken", },
    ],
    [ParamType.ResearchType]: [
        { val: "ROOM" },
        { val: "MAGIC" },
    ],
    [ParamType.CompProcess]: [
        { val: `"DIG TO CLOSE GOLD"`, },
        { val: `"DIG TO GOLD"`, },
        { val: `"DIG TO GREEDY GOLD"`, },
        { val: `"DIG TO GREEDY GOLD2"`, },
        { val: `"BUILD A TREASURE ROOM"`, },
        { val: `"BUILD A LAIR ROOM"`, },
        { val: `"BUILD A LAIR ROOM 4x4"`, },
        { val: `"BUILD A HATCHERY"`, },
        { val: `"BUILD A TRAINING ROOM"`, },
        { val: `"BUILD A RESEARCH ROOM"`, },
        { val: `"BUILD A WORKSHOP ROOM"`, },
        { val: `"BUILD A BARRACK ROOM"`, },
        { val: `"BUILD A GRAVEYARD ROOM"`, },
        { val: `"BUILD A TEMPLE ROOM"`, },
        { val: `"BUILD A SCAVENGER ROOM"`, },
        { val: `"BUILD A TORTURE ROOM"`, },
        { val: `"BUILD A PRISON ROOM"`, },
        { val: `"BUILD ALL ROOM 4x4"`, },
        { val: `"BUILD ALL ROOM 3x3"`, },
        { val: `"MOVE CREATURE TO TRAINING"`, },
        { val: `"MOVE CREATURE TO BEST ROOM"`, },
        { val: `"COMPUTER CHECK HATES"`, },
        { val: `"BUILD AND DEFEND COMPUTER"`, },
        { val: `"ATTACK SAFE ATTACK"`, },
        { val: `"ATTACK PLAN 1"`, },
        { val: `"SIGHT OF EVIL SCARE"`, },
        { val: `"SIGHT OF EVIL"`, },
        { val: `"DIG TO AN ENTRANCE"`, },
    ],
    [ParamType.CompEvent]: [
        { val: `"EVENT DUNGEON BREACH"` },
        { val: `"EVENT ROOM ATTACK"` },
        { val: `"EVENT HEART UNDER ATTACK"` },
        { val: `"EVENT TREASURE ROOM FULL"` },
        { val: `"EVENT LIVING SPACE FULL"` },
        { val: `"EVENT FIGHT"` },
        { val: `"EVENT FIGHT TEST"` },
        { val: `"EVENT CHECK FIGHTERS"` },
        { val: `"EVENT MAGIC FOE"` },
        { val: `"EVENT CHECK ROOMS FULL"` },
        { val: `"EVENT SAVE IMPS"` },
        { val: `"EVENT PAY DAY"` },
        { val: `"EVENT ROOM LOST"` },
        { val: `"EVENT MOANING PRISONER"` },
        { val: `"EVENT SAVE TORTURED"` },
        { val: `"EVENT ENEMY DOOR"` },
    ],
    [ParamType.CompGlobal]: [
        { val: `"COMPUTER_ATTACK_MAGIC"`, },
        { val: `"COMPUTER_WAIT_FOR_BRIDGE"`, },
        { val: `"COMPUTER_MAGIC_SPEED_UP"`, },
        { val: `"COMPUTER_DIG_TO_NEUTRAL"`, },
        { val: `"COMPUTER_SLAP_IMPS"`, },
        { val: `"COMPUTER_MOVE_CREATURES_TO_DEFEND"`, },
        { val: `"COMPUTER_MOVE_CREATURE_TO_POS"`, },
        { val: `"COMPUTER_MOVE_CREATURE_TO_ROOM"`, },
        { val: `"COMPUTER_PICKUP_FOR_ATTACK"`, },
        { val: `"COMPUTER_MAGIC_CALL_TO_ARMS"`, },
        { val: `"COMPUTER_DIG_TO_ATTACK"`, },
        { val: `"COMPUTER_DIG_TO_GOLD"`, },
        { val: `"COMPUTER_DIG_TO_ENTRANCE"`, },
        { val: `"COMPUTER_PLACE_ROOM"`, },
        { val: `"COMPUTER_CHECK_ROOM_DUG"`, },
        { val: `"COMPUTER_DIG_ROOM"`, },
        { val: `"COMPUTER_DIG_ROOM_PASSAGE"`, },
        { val: `"COMPUTER_SELL_TRAPS_AND_DOORS"`, },
    ],
    [ParamType.CompCheck]: [
        { val: `"CHECK MONEY"` },
        { val: `"CHECK EXPAND ROOM"` },
        { val: `"CHECK AVAILIABLE TRAP"` },
        { val: `"CHECK FOR NEUTRAL PLACES"` },
        { val: `"CHECK AVAILIABLE DOOR"` },
        { val: `"CHECK FOR ENEMY ENTRANCES"` },
        { val: `"CHECK FOR SLAP IMP"` },
        { val: `"CHECK FOR SPEED UP"` },
        { val: `"CHECK FOR QUICK ATTACK"` },
        { val: `"CHECK TO PRETTY"` },
        { val: `"CHECK FOR ENOUGH IMPS"` },
        { val: `"MOVE CREATURE TO ROOM"` },
        { val: `"MOVE CREATURE TO BEST ROOM"` },
        { val: `"COMPUTER CHECK HATES"` },
        { val: `"COMPUTER CHECK IMPRISONMENT"` },
    ],
    [ParamType.SlabType]: [
        { val: "HARD" },
        { val: "GOLD" },
        { val: "DIRT" },
        { val: "TORCH_DIRT" },
        { val: "DRAPE_WALL" },
        { val: "TORCH_WALL" },
        { val: "TWINS_WALL" },
        { val: "WOMAN_WALL" },
        { val: "PAIR_WALL" },
        { val: "DAMAGED_WALL" },
        { val: "PATH" },
        { val: "PRETTY_PATH" },
        { val: "LAVA" },
        { val: "WATER" },
        { val: "ENTRANCE_ZONE" },
        { val: "SLAB15" },
        { val: "TREASURY_AREA" },
        { val: "SLAB17" },
        { val: "BOOK_SHELVES" },
        { val: "SLAB19" },
        { val: "PRISON_AREA" },
        { val: "SLAB21" },
        { val: "TORTURE_AREA" },
        { val: "SLAB23" },
        { val: "TRAINING_AREA" },
        { val: "SLAB25" },
        { val: "HEART_PEDESTAL" },
        { val: "SLAB27" },
        { val: "WORKSHOP_AREA" },
        { val: "SLAB29" },
        { val: "SCAVENGE_AREA" },
        { val: "SLAB31" },
        { val: "TEMPLE_POOL" },
        { val: "SLAB33" },
        { val: "GRAVE_AREA" },
        { val: "SLAB35" },
        { val: "HATCHERY" },
        { val: "SLAB37" },
        { val: "LAIR_AREA" },
        { val: "SLAB39" },
        { val: "BARRACK_AREA" },
        { val: "SLAB41" },
        { val: "DOOR_WOODEN" },
        { val: "DOOR_WOODEN2" },
        { val: "DOOR_BRACE" },
        { val: "DOOR_BRACE2" },
        { val: "DOOR_STEEL" },
        { val: "DOOR_STEEL2" },
        { val: "DOOR_MAGIC" },
        { val: "DOOR_MAGIC2" },
        { val: "SLAB50" },
        { val: "BRIDGE_FRAME" },
        { val: "GEMS" },
        { val: "GUARD_AREA" },
        { val: "NULL" },
        { val: "ENTRANCE" },
        { val: "TREASURE" },
        { val: "RESEARCH" },
        { val: "PRISON" },
        { val: "TORTURE" },
        { val: "TRAINING" },
        { val: "DUNGEON_HEART" },
        { val: "WORKSHOP" },
        { val: "SCAVENGER" },
        { val: "TEMPLE" },
        { val: "GRAVEYARD" },
        { val: "BARRACKS" },
        { val: "GARDEN" },
        { val: "LAIR" },
        { val: "BRIDGE" },
        { val: "GUARD_POST" },
    ],
    [ParamType.CustomBox]: new Array(256).fill(0).map((e, i) => ({
        val: `BOX${i}_ACTIVATED`
    })),
    [ParamType.Object]: [
        { val: "BARREL" },
        { val: "TORCH" },
        { val: "GOLD_CHEST" },
        { val: "TEMPLE_STATUE" },
        { val: "SOUL_CONTAINER" },
        { val: "GOLD" },
        { val: "TORCHUN" },
        { val: "STATUEWO" },
        { val: "CHICKEN_GRW" },
        { val: "CHICKEN_MAT" },
        { val: "SPELLBOOK_HOE" },
        { val: "SPELLBOOK_IMP" },
        { val: "SPELLBOOK_OBEY" },
        { val: "SPELLBOOK_SLAP" },
        { val: "SPELLBOOK_SOE" },
        { val: "SPELLBOOK_CTA" },
        { val: "SPELLBOOK_CAVI" },
        { val: "SPELLBOOK_HEAL" },
        { val: "SPELLBOOK_HLDAUD" },
        { val: "SPELLBOOK_LIGHTN" },
        { val: "SPELLBOOK_SPDC" },
        { val: "SPELLBOOK_PROT" },
        { val: "SPELLBOOK_CONCL" },
        { val: "CTA_ENSIGN" },
        { val: "ROOM_FLAG" },
        { val: "ANVIL" },
        { val: "PRISON_BAR" },
        { val: "CANDLESTCK" },
        { val: "GRAVE_STONE" },
        { val: "STATUE_HORNY" },
        { val: "TRAINING_POST" },
        { val: "TORTURE_SPIKE" },
        { val: "TEMPLE_SPANGLE" },
        { val: "POTION_PURPLE" },
        { val: "POTION_BLUE" },
        { val: "POTION_GREEN" },
        { val: "POWER_HAND" },
        { val: "POWER_HAND_GRAB" },
        { val: "POWER_HAND_WHIP" },
        { val: "CHICKEN_STB" },
        { val: "CHICKEN_WOB" },
        { val: "CHICKEN_CRK" },
        { val: "GOLDL" },
        { val: "SPINNING_KEY" },
        { val: "SPELLBOOK_DISEASE" },
        { val: "SPELLBOOK_CHKN" },
        { val: "SPELLBOOK_DWAL" },
        { val: "SPELLBOOK_TBMB" },
        { val: "HERO_GATE" },
        { val: "SPINNING_KEY2" },
        { val: "ARMOUR" },
        { val: "GOLD_HOARD_1" },
        { val: "GOLD_HOARD_2" },
        { val: "GOLD_HOARD_3" },
        { val: "GOLD_HOARD_4" },
        { val: "GOLD_HOARD_5" },
        { val: "LAIR_WIZRD" },
        { val: "LAIR_BARBR" },
        { val: "LAIR_ARCHR" },
        { val: "LAIR_MONK" },
        { val: "LAIR_DWRFA" },
        { val: "LAIR_KNGHT" },
        { val: "LAIR_AVATR" },
        { val: "LAIR_TUNLR" },
        { val: "LAIR_WITCH" },
        { val: "LAIR_GIANT" },
        { val: "LAIR_FAIRY" },
        { val: "LAIR_THIEF" },
        { val: "LAIR_SAMUR" },
        { val: "LAIR_HORNY" },
        { val: "LAIR_SKELT" },
        { val: "LAIR_GOBLN" },
        { val: "LAIR_DRAGN" },
        { val: "LAIR_DEMSP" },
        { val: "LAIR_FLY" },
        { val: "LAIR_DKMIS" },
        { val: "LAIR_SORCR" },
        { val: "LAIR_BILDM" },
        { val: "LAIR_IMP" },
        { val: "LAIR_BUG" },
        { val: "LAIR_VAMP" },
        { val: "LAIR_SPIDR" },
        { val: "LAIR_HLHND" },
        { val: "LAIR_GHOST" },
        { val: "LAIR_TENTC" },
        { val: "SPECBOX_REVMAP" },
        { val: "SPECBOX_RESURCT" },
        { val: "SPECBOX_TRANSFR" },
        { val: "SPECBOX_STEALHR" },
        { val: "SPECBOX_MULTPLY" },
        { val: "SPECBOX_INCLEV" },
        { val: "SPECBOX_MKSAFE" },
        { val: "SPECBOX_HIDNWRL" },
        { val: "WRKBOX_BOULDER" },
        { val: "WRKBOX_ALARM" },
        { val: "WRKBOX_POISONG" },
        { val: "WRKBOX_LIGHTNG" },
        { val: "WRKBOX_WRDOFPW" },
        { val: "WRKBOX_LAVA" },
        { val: "WRKBOX_DUMMY2" },
        { val: "WRKBOX_DUMMY3" },
        { val: "WRKBOX_DUMMY4" },
        { val: "WRKBOX_DUMMY5" },
        { val: "WRKBOX_DUMMY6" },
        { val: "WRKBOX_DUMMY7" },
        { val: "WRKBOX_WOOD" },
        { val: "WRKBOX_BRACE" },
        { val: "WRKBOX_STEEL" },
        { val: "WRKBOX_MAGIC" },
        { val: "WRKBOX_ITEM" },
        { val: "HEARTFLAME_RED" },
        { val: "DISEASE" },
        { val: "SCAVENGE_EYE" },
        { val: "WORKSHOP_MACHINE" },
        { val: "GUARDFLAG_RED" },
        { val: "GUARDFLAG_BLUE" },
        { val: "GUARDFLAG_GREEN" },
        { val: "GUARDFLAG_YELLOW" },
        { val: "FLAG_POST" },
        { val: "HEARTFLAME_BLUE" },
        { val: "HEARTFLAME_GREEN" },
        { val: "HEARTFLAME_YELLOW" },
        { val: "POWER_SIGHT" },
        { val: "POWER_LIGHTNG" },
        { val: "TORTURER" },
        { val: "LAIR_ORC" },
        { val: "POWER_HAND_GOLD" },
        { val: "SPINNCOIN" },
        { val: "STATUE2" },
        { val: "STATUE3" },
        { val: "STATUE4" },
        { val: "STATUE5" },
        { val: "SPECBOX_CUSTOM" },
        { val: "SPELLBOOK_ARMG" },
        { val: "SPELLBOOK_POSS" },
        { val: "GOLD_BAG" },
    ],
    [ParamType.SacrificeCmd]: [
        { val: "MkCreature" },
        { val: "MkGoodHero" },
        { val: "NegSpellAll" },
        { val: "PosSpellAll" },
        { val: "NegUniqFunc" },
        { val: "PosUniqFunc" },
        { val: "CUSTOMREWARD" },
        { val: "CUSTOMPUNISH" },
    ],
    [ParamType.FillType]: [
        {
            val: "NONE",
            doc: "No fill"
        },
        {
            val: "MATCH",
            doc: "Replace only slabs of same type"
        },
        {
            val: "FLOOR",
            doc: "Replace all slabs of the same type, and all adjacent attached floor slabs"
        },
        {
            val: "BRIDGE",
            doc: "Replace all slabs of the same type, and all adjacent attached floor slabs, include bridges and floor attached by the bridges"
        },
    ],
    [ParamType.LockState]: [
        { val: "LOCKED" },
        { val: "UNLOCKED" },
    ],
};