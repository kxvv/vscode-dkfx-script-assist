import { DescProvider } from "./DescProvider";
import { MappersDk } from "./MappersDk";
import { DkEntity } from "./model/DkEntity";
import { DkSuggestion } from "./model/DkSuggestion";
import { ParamType } from "./model/ParamType";
import { Word } from "./model/Word";
import { VAR_COMPOSITES } from "./TypeTools";
import { Utils } from "./Utils";

const DK_ENTITIES: Record<string, DkEntity[]> = {
    [ParamType.Version]: [
        { val: "1" },
    ],
    [ParamType.Player]: [
        { val: "PLAYER0", doc: "The RED player", preselect: true },
        { val: "PLAYER1", doc: "The BLUE player", },
        { val: "PLAYER2", doc: "The GREEN player", },
        { val: "PLAYER3", doc: "The YELLOW player", },
        { val: "PLAYER4", doc: "The PURPLE player", },
        { val: "PLAYER5", doc: "The BLACK player", },
        { val: "PLAYER6", doc: "The ORANGE player", },
        { val: "RED", doc: "PLAYER0's equivalent", },
        { val: "BLUE", doc: "PLAYER1's equivalent", },
        { val: "GREEN", doc: "PLAYER2's equivalent", },
        { val: "YELLOW", doc: "PLAYER3's equivalent", },
        { val: "PURPLE", doc: "PLAYER4's equivalent", },
        { val: "BLACK", doc: "PLAYER5's equivalent", },
        { val: "ORANGE", doc: "PLAYER6's equivalent", },
        { val: "WHITE", doc: "Heroes/PLAYER_GOOD's equivalent" },
        { val: "PLAYER_GOOD", doc: "The heroes" },
        { val: "PLAYER_NEUTRAL", doc: "The neutral player" },
    ],
    [ParamType.PlayerColor]: [
        { val: "RED", },
        { val: "BLUE", },
        { val: "GREEN", },
        { val: "YELLOW", },
        { val: "WHITE", },
        { val: "PURPLE", },
        { val: "ORANGE", },
        { val: "BLACK", },
    ],
    [ParamType.Keeper]: [
        { val: "PLAYER0", doc: "The RED player", preselect: true },
        { val: "PLAYER1", doc: "The BLUE player", },
        { val: "PLAYER2", doc: "The GREEN player", },
        { val: "PLAYER3", doc: "The YELLOW player", },
        { val: "PLAYER4", doc: "The PURPLE player", },
        { val: "PLAYER5", doc: "The BLACK player", },
        { val: "PLAYER6", doc: "The ORANGE player", },
        { val: "PLAYER_GOOD", doc: "The WHITE/HERO player (if set to be a player)", },
        { val: "RED", doc: "PLAYER0's equivalent", },
        { val: "BLUE", doc: "PLAYER1's equivalent", },
        { val: "GREEN", doc: "PLAYER2's equivalent", },
        { val: "YELLOW", doc: "PLAYER3's equivalent", },
        { val: "PURPLE", doc: "PLAYER4's equivalent", },
        { val: "BLACK", doc: "PLAYER5's equivalent", },
        { val: "ORANGE", doc: "PLAYER6's equivalent", },
        { val: "WHITE", doc: "PLAYER_GOOD's equivalent (if set to be a player)", },
    ],
    [ParamType.PlayerGood]: [
        { val: "PLAYER_GOOD", doc: "The heroes" },
        { val: "WHITE", doc: "Heroes/PLAYER_GOOD's equivalent" },
    ],
    [ParamType.AllPlayers]: [
        { val: "ALL_PLAYERS" },
    ],
    [ParamType.Texture]: [
        { val: "NONE" },
        { val: "STANDARD" },
        { val: "ANCIENT" },
        { val: "WINTER" },
        { val: "SNAKE_KEY" },
        { val: "STONE_FACE" },
        { val: "VOLUPTUOUS" },
        { val: "BIG_BREASTS" },
        { val: "ROUGH_ANCIENT" },
        { val: "SKULL_RELIEF" },
        { val: "DESERT_TOMB" },
        { val: "GYPSUM" },
        { val: "LILAC_STONE" },
        { val: "SWAMP_SERPENT" },
        { val: "LAVA_CAVERN" },
        { val: "LATERITE_CAVERN" },
    ],
    [ParamType.Timer]: new Array(8).fill(0).map((e, i) => ({
        val: "TIMER" + i,
        doc: `The timer number ${i}. Each player has their own timer sets.`
    })),
    [ParamType.Flag]: new Array(8).fill(0).map((e, i) => ({
        val: "FLAG" + i,
        doc: `The flag number ${i}. Each player has their own flag sets.`,
        ...(i === 0 && { preselect: true })
    })),
    [ParamType.CampaignFlag]: new Array(8).fill(0).map((e, i) => ({
        val: "CAMPAIGN_FLAG" + i,
        doc: `Campaign flag number ${i}. Each player has their own flag sets. Values set to campaign flags can be used throughout the campaign in future levels.`
    })),
    [ParamType.Computer]: [
        {
            val: "0",
            doc: "A general computer player with everything turned on. Builds rooms quickly and is aggressive.",
            preselect: true
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
        {
            val: "ROAMING",
            doc: "Roaming creatures that do not need a dungeon to function. PLAYER_GOOD is set to ROAMING by default.",
        },
        {
            val: "OFF",
            doc: "Turns the computer back into a zombie player, without any activity.",
        },
    ],
    [ParamType.Creature]: [
        ..."WIZARD,TUNNELLER,BARBARIAN,ARCHER,MONK,KNIGHT,AVATAR,GIANT,FAIRY,THIEF,SAMURAI,IMP,HORNY,SKELETON,TROLL,DRAGON,DEMONSPAWN,FLY,DARK_MISTRESS,BILE_DEMON,VAMPIRE,SPIDER,HELL_HOUND,GHOST,TENTACLE,ORC,TIME_MAGE,DRUID"
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
    [ParamType.RoomAll]: [
        ..."TREASURE,PRISON,TORTURE,TRAINING,WORKSHOP,SCAVENGER,TEMPLE,GRAVEYARD,BARRACKS,LAIR,BRIDGE,GUARD_POST,DUNGEON_HEART"
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
    [ParamType.RoomConfig]: [
        { val: "TooltipTextID", doc: `` },
        { val: "Cost", doc: `` },
        { val: "Health", doc: `` },
        { val: "SlabAssign", doc: `` },
        { val: "Roles", doc: `` },
        { val: "Properties", doc: `BUILD_TILL_BROKE CANNOT_BE_CLAIMED CANNOT_BE_SOLD CANNOT_VANDALIZE HAS_NO_ENSIGN.` },
        { val: "Messages", doc: `Speech messages related to the room, in order: 'Needed', 'TooSmall', 'NoRoute'.` },
        { val: "AmbientSndSample", doc: `Sound sample playing in a loop when hovering over it on screen.` },
        { val: "TotalCapacity", doc: `Algorithm used to compute room capacity.` },
        { val: "UsedCapacity", doc: `Algorithm used to used storage space and used worker space.` },
        { val: "SlabSynergy", doc: `Slab that it also receives full efficiency bonus from.` },
        { val: "StorageHeight", doc: `Height in cubes at which storage is created. Negative values for any.` },
        { val: "SymbolSprites", doc: `Sprite icon of the room, large size and medium size.` },
        { val: "PointerSprites", doc: `Sprite pointer of the room, used when placing the room.` },
        { val: "PanelTabIndex", doc: `Position of the room in the panel, 0 is hidden, 1-16 first page, 17-32 second page. Place in 4x4 grid.` }
    ],
    [ParamType.RoomProperty]: [
        { val: "HAS_NO_ENSIGN", doc: "1 - The room does not display a room flag with.", },
        { val: "CANNOT_VANDALIZE", doc: "2 - The room slabs cannot be attacked by creatures.", },
        { val: "BUILD_TILL_BROKE", doc: "4 - Computers will spend their last gold building this.", },
        { val: "CANNOT_BE_SOLD", doc: "8 - The room slabs cannot be sold.", },
        { val: "CANNOT_BE_CLAIMED", doc: "16 - The room cannot be claimed.", },
    ],
    [ParamType.SpellFlag]: [
        { val: `SLOW`, doc: `1 - Halves movement speed and doubles instances cooldowns.` },
        { val: `SPEED`, doc: `2 - Doubles movement speed and halves instances cooldowns. Also boosts job efficiency.` },
        { val: `ARMOUR`, doc: `4 - Increases armour by 25% and prevents 'POWER_LIGHTNING' damage.` },
        { val: `REBOUND`, doc: `8 - Bounces back projectiles (shots) that are not 'REBOUND_IMMUNE' to enemies.` },
        { val: `FLYING`, doc: `16 - Allows movement over lava without taking damage. It affects pathfinding.` },
        { val: `INVISIBILITY`, doc: `32 - Makes the target invisible unless attacking.` },
        { val: `SIGHT`, doc: `64 - Allows the target to detect invisible creatures.` },
        { val: `LIGHT`, doc: `128 - Creates a halo of light around the creature. Cosmetic.` },
        { val: `DISEASE`, doc: `256 - Infects the target with a condition that spreads by contact.` },
        { val: `CHICKEN`, doc: `512 - Transforms the target into a defenseless chicken, vulnerable to hungry creatures that cross its path.` },
        { val: `POISON_CLOUD`, doc: `1024 - Not functional on spells, exists only for immunity.` },
        { val: `FREEZE`, doc: `2048 - Stuns the target, making it unable to move.` },
        { val: `MAD_KILLING`, doc: `4096 - Confuses the target, causing it to potentially attack its own allies.` },
        { val: `FEAR`, doc: `8192 - Causes the target to become momentarily scared, causing it to flee and avoid combat.` },
        { val: `HEAL`, doc: `16384 - Indicates that the spell heals the target. If linked, level-based 'Power' values are used for the amount of health restored.` },
        { val: `TELEPORT`, doc: `32768 - If self-cast, jumps to its next objective or place to fulfill its needs. If cast on a target, jumps it to its lair or flee point.` },
        { val: `TIMEBOMB`, doc: `65536 - Sets a countdown on the target, making it move toward enemies to explode on impact, dealing damage from the linked shot.` },
        { val: `WIND`, doc: `131072 - Not functional on spells, exists only for immunity.` },
    ],
    [ParamType.Power]: [
        ..."POWER_IMP,POWER_OBEY,POWER_SIGHT,POWER_CALL_TO_ARMS,POWER_CAVE_IN,POWER_HEAL_CREATURE,POWER_HOLD_AUDIENCE,POWER_LIGHTNING,POWER_SPEED,POWER_PROTECT,POWER_CONCEAL,POWER_DISEASE,POWER_CHICKEN,POWER_DESTROY_WALLS,POWER_ARMAGEDDON,POWER_REBOUND,POWER_FREEZE,POWER_TIME_BOMB,POWER_SLOW,POWER_FLIGHT,POWER_VISION"
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
            val: "NOPOWER",
            doc: "Empty power. Use when configuring existing power's properties."
        },
    ],
    [ParamType.Door]: [
        {
            val: "WOOD",
        },
        {
            val: "BRACED",
        },
        {
            val: "STEEL",
        },
        {
            val: "MAGIC",
        },
        {
            val: "SECRET",
            doc: "This door remains hidden to enemies unless they observe it closely or see it opening.",
        },
        {
            val: "MIDAS",
            doc: "Drains gold from the owner when it would otherwise take damage.",
        },
    ],
    [ParamType.Trap]: [
        ..."BOULDER,ALARM,POISON_GAS,LIGHTNING,WORD_OF_POWER,LAVA,TNT"
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
        },
        {
            val: "TOTAL_CREATURES",
            doc: "The number of creatures that player has got",
        },
        {
            val: "EVIL_CREATURES",
            doc: "The number of evil creatures that player has got",
        },
        {
            val: "GOOD_CREATURES",
            doc: "The number of heroes that player has got",
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
            val: "TOTAL_TRAPS",
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
        {
            val: "CREATURES_TRANSFERRED",
            doc: "How many creatures have been send to the next realm",
        },
        {
            val: "ACTIVE_BATTLES",
            doc: "The amount of battles going on for the player. Multiple creatures can be part of a single battle.",
        },
        {
            val: "VIEW_TYPE",
            doc: "What the player is currently viewing. 1 for dungeon view, 2 for possession, 4 for map screen",
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
            preselect: true,
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
        {
            val: "SABOTAGE_ROOMS",
            doc: "Creatures will attack rooms without initializing combat if it can be avoided.",
        },
        {
            val: "SNIPE_DUNGEON_HEART",
            doc: "Creatures will ignore any non heart combat.",
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
        { val: "18", doc: "Bridge", preselect: true, },
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
            preselect: true,
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
        {
            val: "4",
            doc: "Hero dungeon - PLAYER_GOOD",
        },
        {
            val: "6",
            doc: "The purple player - PLAYER4",
        },
        {
            val: "7",
            doc: "The black player - PLAYER5",
        },
        {
            val: "8",
            doc: "The orange player - PLAYER6",
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
            preselect: true,
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
            val: "SOUND",
            preselect: true,
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
        {
            val: "NO_RESURRECT",
            doc: "Creature cannot be resurrected with a resurrect creature special.",
        },
        {
            val: "NO_TRANSFER",
            doc: "Creature cannot be transferred with a transfer creature special.",
        },
        {
            val: "EVENTFUL_DEATH",
            doc: "Creature's death location will be stored in LAST_DEATH_EVENT.",
        },
    ],
    [ParamType.CreatureTendency]: [
        {
            val: "FLEE"
        },
        {
            val: "IMPRISON",
            preselect: true,
        },
    ],
    [ParamType.CreatureConfig]: [
        { val: "Health", doc: `Amount of health points a creature have, range is 1..10000.` },
        { val: "HealRequirement", doc: `When a creature health falls below requirement, the creature refuse work and go to sleep. In battle, it will priorize using the Heal spell when available. Also a computer player will pick the creature and place it in lair. This works for autonomous computer players and for assistance players. The value is scaled 0..255, where 0 means never heal and 255 means heal even if small fraction of health was lost. Should be larger than CriticalHealthPercentage in rules.cfg.` },
        { val: "HealThreshold", doc: `When a creature health falls below threshold, it means he could use healing. If an idle creature has Heal spell available, it will try to use it when below the treshold. Creatures sleeping to heal up, will stop sleeping when they go above the treshold. The value is scaled 0..255, like HealRequirement. HealThreshold needs to be larger or equal than HealRequirement.` },
        { val: "Strength", doc: `Strength is equal to the amount of melee combat damage a creature makes.` },
        { val: "Armour", doc: `Percentage of damage points absorbed by creature armour. Scaled 0..200, where 0 is no absorption and 200 is 80% absorption. Value of armour is increased by 25% by the protect spell. It does not increase with experience, and can never exceed 80%.` },
        { val: "Dexterity", doc: `Dexterity influences the odds for successful attack. It is scaled 0..255. If it is higher than attacked creature defence, then odds are higher than 50%. Every 26 points of difference between shooter dexterity and victim defence gives ~10% to the odds. Also, odds can never get higher than 88% or lower than 12%.` },
        { val: "FearWounded", doc: `Wounded fear set to 101 will make creature escape from any combat other than protecting heart, or a combat with single creature of the same kind. This special value works the same way regardless of creature tendencies. Smaller value will make the creature escape if it has less than given percentage of health left. 0: never escape, 100: escape even if no health is lost.` },
        { val: "FearStronger", doc: `Fear of stronger creatures - how many times the enemy has to be stronger in order for the creature to escape. Value of 100 will make the creature fear an enemy with same strength, 200 will make it fear enemies which are twice as strong, etc. It uses melee damage, calculated based on strength, luck and creature level. The proper range of this value is 100..30000 %.` },
        { val: "FearsomeFactor", doc: `FearStronger values are based on Melee damage and Health, so spells and abilities are ignored. To compensate, units with good skills get a bonus factor. Both fear and intimidation are multiplied by FearsomeFactor before they are used. A value of 100 leaves it unchanged, 200 will make it appear twice as strong, etc. The proper range of this value is 10..10000 %.` },
        { val: "Defence", doc: `Defence influences the odds for blocking an enemy attack. It is scaled 0..255. It is used to counter dexterity. Details are provided in the dexterity explanation above.` },
        { val: "Luck", doc: `Luck is the chance of inflicting double damage or getting half damage from hit. It is ranged 0..100, and it's constant - doesn't change with experience level.` },
        { val: "Recovery", doc: `Amount of health points regenerated every RecoveryFrequency turns when sleeping in lair. Note that the amount is scaled with creature level - so always the same part of creature health is regenerated. Default value of RecoveryFrequency is 10 turns.` },
        { val: "TokingRecovery", doc: `Amount of health points regenerated every RecoveryFrequency turns when Toking. It is what creatures do without HealRequirement or LairSize, so Imps.` },
        { val: "HungerRate", doc: `Amount of game turns before the creature gets hungry and needs to eat at the Hatchery.` },
        { val: "HungerFill", doc: `Amount of food the creature must eat to stop being hungry and leave the Hatchery.` },
        { val: "LairSize", doc: `Defines how much capacity the lair totem of the creature will take on the lair.` },
        { val: "HurtByLava", doc: `Amount of damage points inflicted (every game turns) when a creature walks on lava slabs. Setting this to 0 will make the creature immune to lava.` },
        { val: "BaseSpeed", doc: `Defines the movement speed of the creature, range is 0..255.` },
        { val: "GoldHold", doc: `Defines the maximum gold the creature can hold at a time.` },
        { val: "Size", doc: `Creature clipbox size - XY and Z.` },
        { val: "AttackPreference", doc: `Defines how the creature will fight. MELEE: close combat - RANGED: at distance.` },
        { val: "Pay", doc: `Amount of gold the creature takes at payday.` },
        { val: "SlapsToKill", doc: `Amount of slap required to kill the creature at full health. Affected by Armour.` },
        { val: "DamageToBoulder", doc: `Amount of health substracted to the Boulder when it hits the creature.` },
        { val: "ThingSize", doc: `Creature thing size - XY and Z, one cube is 256x256.` },
        { val: "LairObject", doc: `The object the creature will create to use as a lair. Object needs to be configured correctly in objects.cfg too.` },
        { val: "PrisonKind", doc: `Defines the kind of creature it will become if it dies of starvation while imprisoned. Setting this to NULL will check if the creature has the 'HUMANOID_SKELETON' property and will default to the room creature creation specified in terrain.cfg.` },
        { val: "TortureKind", doc: `Defines the kind of creature it will become if it dies from torture. The same rule applies as for PrisonKind, except it does not consider the 'HUMANOID_SKELETON' property.` },
        { val: "SpellImmunity", doc: `Creature immunities. Takes 'SpellFlags'.` },
        { val: "Properties", doc: `Creature properties: BLEEDS - the creature leaves blood when is hit, slapped, dying or being injured in any way. UNAFFECTED_BY_WIND - the creature isn't pushed back by Wind spell. IMMUNE_TO_GAS - the creature isn't injured by Gas Traps and Farts. HUMANOID_SKELETON - the creature leaves a skeleton if left in prison to die. PISS_ON_DEAD - creature feels urge to piss on nearby dead bodies. FLYING - creature normally isn't touching ground when moving and can move up and down. SEE_INVISIBLE - creature has natural ability which works like Sight spell. PASS_LOCKED_DOORS - creature can move through locked doors and won't fight with doors. SPECIAL_DIGGER - creature can dig and perform other dungeon tasks. ARACHNID - creature is kind of spider. DIPTERA - creature is kind of fly. LORD - creature is lord of the land, usually arrives to level as final boss, and at arrival you can hear "beware, the lord of the land approaches". EVENTFUL_DEATH - when the creature dies the LAST_DEATH_EVENT[] script variable is updated, so mapmaker can use the location. SPECTATOR - creature is just a spectator for multiplayer games. EVIL - creature has evil nature. NEVER_CHICKENS - creature isn't affected by Chicken spell. IMMUNE_TO_BOULDER - when boulder trap hits the creature, falls apart without dealing any damage. NO_CORPSE_ROTTING - Creature body can't be taken to rot on graveyard and will disappear quickly. NO_ENMHEART_ATTCK - Creature won't attack enemy dungeon heart on sight. TREMBLING - Creature is so heavy that ground trembles when it falls. FAT - Creature is so fat that he needs a brief rest during his movement animation. FEMALE - Creature is a female, does female sounds and has female name. INSECT - Creature is an insect (note that DIPTERA and ARACHNID creatures should also have INSECT set explicitly). ONE_OF_KIND - Creature name is set to kind name defined by 'NameTextID'. NO_IMPRISONMENT - Creature cannot be stunned for prison. NO_RESURRECT - Creature cannot be resurrected with a resurrect creature special. NO_TRANSFER - Creature cannot be transferred with a transfer creature special. NO_STEAL_HERO - Creature cannot be stolen from a steal hero special. PREFER_STEAL - Creature can be generated from steal hero special if there is nothing to steal from. IMMUNE_TO_DISEASE - Creature cannot get diseased. ILLUMINATED - A bright light will shine from the Creature. ALLURING_SCVNGR - When scavenging will give the keeper a portal boost compared to rival keepers.` },
        { val: "EntranceRoom", doc: `Rooms required to attract the creature from entrance, and number of slabs which is needed (max 3 rooms). Order of the rooms here affects chances of attraction - if the room in first slot is large, it greatly increases attraction chance. If 2nd slot room is large, it adds half the attraction points the first slot would. Third slot gives 1/3 points. Sometimes you may want to leave first slot empty to make attraction more stable.` },
        { val: "RoomSlabsRequired", doc: `Amount of slabs required of each room defined above, follow the same order.` },
        { val: "BaseEntranceScore", doc: `Base chance of attraction. This value, added to room attractiveness and divided by sum of scores for all creatures, determines the chance of the creature of this kind being attracted from entrance pool. Standard value is 10, range is 0..1000.` },
        { val: "ScavengeRequirement", doc: `Determines the amount of scavenge points required for a first lv1 creature of this kind to be scavenged. The amount of points required to scavenge next creature is a multiplication of this value.` },
        { val: "TortureTime", doc: `Amount of game turns after which the creature reacts to torture, by either revealing information or converting to enemy.` },
        { val: "EatFood", doc: `How many anger points are generated while doing various tasks. Use negative value to reduce annoyance. Whenever the creature eats.` },
        { val: "WillNotDoJob", doc: `Whenever the creature is dropped on a room if the job is defined in 'NotDoJobs'.` },
        { val: "InHand", doc: `Whenever the creature is picked up by hand, apply every game turns while in hand.` },
        { val: "NoLair", doc: `Whenever the creature doesn't have access to a Lair and wants to rest.` },
        { val: "NoHatchery", doc: `Whenever the creature doesn't have access to a Hatchery and wants to eat.` },
        { val: "WokenUp", doc: `Whenever the creature is awakened by a fight, picked up by hand, or slapped.` },
        { val: "StandingOnDeadEnemy", doc: `Whenever the creature stand/walk on a dead enemy body, apply every game turns while on the dead enemy body. Usually negative.` },
        { val: "Sulking", doc: `Whenever the creature starts to get annoyed, apply every game turns.` },
        { val: "NoSalary", doc: `Whenever the creature is not paid during payday, either with no access to a Treasure Room or not enough gold.` },
        { val: "Slapped", doc: `Whenever the creature is slapped.` },
        { val: "StandingOnDeadFriend", doc: `Whenever the creature stand/walk on a dead friend body, apply every game turns while on the dead friend body.` },
        { val: "InTorture", doc: `Whenever the creature is tortured, apply every game turns.` },
        { val: "InTemple", doc: `Whenever the creature prays at temple, apply every game turns. Usually negative.` },
        { val: "Sleeping", doc: `Whenever the creature sleeps at their lair, apply every game turns. Usually negative.` },
        { val: "GotWage", doc: `Whenever the creature gets paid. Usually negative.` },
        { val: "WinBattle", doc: `Whenever the creature wins a battle. Usually negative.` },
        { val: "Untrained", doc: `Amount of game turns required before the creature gets annoyed if not trained. Example: 20 100, every 20 game turns, give 100 anger points.` },
        { val: "OthersLeaving", doc: `Whenever the creature sees others exiting through the entrance.` },
        { val: "JobStress", doc: `Annoyance caused by performing stressful jobs defined in 'StressfulJobs', apply every game turns. Value of 0 will disable annoyance by stressful job.` },
        { val: "GoingPostal", doc: `Annoyance caused by going postal during a primary job. Creature goes postal if other creatures, which wouldn't normally select that job, have been assigned to do it. In that case, the target is attacked and forced to evacuate, and attacker working in the room gains annoyance. Value of 0 will cause the creature never go postal.` },
        { val: "Queue", doc: `Whenever the creature has to wait before performing a job it wants to do (the room is full) or to eat.` },
        { val: "LairEnemy", doc: `The creature engages in combat when it encounters the defined creature in a lair. Will avoid sharing lairs if possible. Up to 5 creature types. Accepts ANY_CREATURE.` },
        { val: "AnnoyLevel", doc: `Amount of annoyance which makes the creature angry. 0 will make creature never get angry, range is 0..32767.` },
        { val: "AngerJobs", doc: `Defines what the creature will do when they are fully annoyed. It's possible to define multiples. KILL_CREATURES - Creature will attempt to kill others creatures. DESTROY_ROOMS - Creature will destroy your rooms. LEAVE_DUNGEON - Creature will exit the dungeon through the entrance. STEAL_GOLD - Creature will steal your gold, the maximum amount is defined with 'GoldHold' parameter. DAMAGE_WALLS - Creature will destroy your walls. MAD_PSYCHO - Creature goes into a frenzy and will attack on sight, creature cannot become happy again. PERSUADE - Creature will annoy other, increasing their anger points. JOIN_ENEMY - Creature may join the enemy keeper if they can reach their dungeon. Leave it empty if you don't want the creature to do anything when they are angry.` },
        { val: "Hearing", doc: `Hearing distance of a creature, in subtiles.` },
        { val: "EyeHeight", doc: `Determines the position of the eye, useful for possession view.` },
        { val: "FieldOfView", doc: `Determines the angle from which the creature can see. Every 256 is 45 degrees, range is 0..2047.` },
        { val: "EyeEffect", doc: `Eye lens used to show possession view, see lenses.cfg for details.` },
        { val: "MaxAngleChange", doc: `Speed of turning around. Determines how many degrees a creature can rotate itself on a single game turn, range is 1..180 degrees.` },
        { val: "WalkingAnimSpeed", doc: `Determines the 'Ambulate' animation speed.` },
        { val: "FixedAnimSpeed", doc: `Walking animation speed is normally modified by creature movement speed. Set it to 1 to use the fixed value.` },
        { val: "FootstepPitch", doc: `Pitch used when making footstep sounds.` },
        { val: "VisualRange", doc: `Determines how far the creature can see, in subtiles.` },
        { val: "PossessSwipeIndex", doc: `Index of the half-transparent swipe appearing when using melee combat in possession.` },
        { val: "NaturalDeathKind", doc: `The way of dying if there are no special circumstances to select another death kind. NORMAL - FLESHEXPLODE - GASFLESHEXPLODE - SMOKEEXPLODE - ICEEXPLODE.` },
        { val: "ShotOrigin", doc: `Place where a shot fired by the creature originates, relative to creature position.` },
        { val: "CorpseVanishEffect", doc: `Effect or EffectElement(on negative numbers) which replaces the creature corpse when it disappears.` },
        { val: "PickUpOffset", doc: `Position of the 'PowerGrab' sprite relative to the hand sprite when picked up.` },
        { val: "StatusOffset", doc: `Position of the status sprites showing creature mood or activity.` },
        { val: "TransparencyFlags", doc: `Makes creature transparant in different ways. Range: 0~3, where 3 is both 1 and 2 together.` },
        { val: "Powers", doc: `Creature spells (instance names), and the creature level at which they're given (max 10). Instances are defined in creature.cfg - an instance may fire a shot, cast spell or do other action.` },
        { val: "PowersLevelRequired", doc: `Level at which an instance defined above is learned.` },
        { val: "LevelsTrainValues", doc: `Training values required to reach higher creature levels.` },
        { val: "GrowUp", doc: `Growing beyond max level - training value, new creature kind and its level. Example: 20000 FLY 5. Accepts ANY_CREATURE for random but evil will stay evil and good will stay good.` },
        { val: "SleepExperience", doc: `Gaining experience from sleeping - slab required near lair and amount of experience. It is enough if one slab of given type exists anywhere next to the room slab, and all creatures inside get the bonus. The formula is 256 for 1 experience point every game turns while sleeping. See terrain.cfg for a list of slab names.` },
        { val: "ExperienceForHitting", doc: `Sets the multiplier for BaseExperienceGain defined in magic.cfg for shots. This value is applied for other creatures when they attack this creature kind.` },
        { val: "Rebirth", doc: `Level at which the creature gains the ability to resurrect, at one lower xp level. Setting this parameter to 1 makes the creature "immortal" as long as it has a lair. 0 disable this ability.` },
        { val: "PrimaryJobs", doc: `The jobs a creature selects for itself if given a choice. See creature.cfg for a list of job names. 'PrimaryJobs', 'SecondaryJobs', 'NotDoJobs', 'StressfulJobs', can all have more than one job defined.` },
        { val: "SecondaryJobs", doc: `The creature selects primary job, unless there is no way to perform such job - in that case, it takes secondary job.` },
        { val: "NotDoJobs", doc: `Jobs which a creature won't do, even if assigned, unless 'Must Obey' power is active.` },
        { val: "StressfulJobs", doc: `Jobs which a creature can do, but doesn't really like. Doing these jobs makes the creature irritated, increasing its anger points every game turns, amount defined with 'JobStress'.` },
        { val: "TrainingValue", doc: `Amount of experience points produced by the creature while training. 0 make the creature unable to train.` },
        { val: "TrainingCost", doc: `Amount of gold required to train, default frequency is 64 game turns - defined in rules.cfg.` },
        { val: "ScavengeValue", doc: `Amount of scavenge points produced by the creature while scavenging. 0 make the creature unable to scavenge.` },
        { val: "ScavengerCost", doc: `Amount of gold required to scavenge, default frequency is 64 game turns - defined in rules.cfg.` },
        { val: "ResearchValue", doc: `Amount of research points produced by the creature while researching. 0 make the creature unable to research.` },
        { val: "ManufactureValue", doc: `Amount of manufacture points produced by the creature while manufacturing. 0 make the creature unable to manufacture.` },
        { val: "PartnerTraining", doc: `Chance of selecting training with another creature instead of training with just the mechanical training post. 0..100%.` },
        { val: "Stand", doc: `The following are indices of graphics sprites used to draw the creature. Graphics sprites are animations made from images, shown while performing various tasks. Linked to from 'Graphics' field of instances in creature.cfg. Numbers from sprites-32. The animation used for standing still.` },
        { val: "Ambulate", doc: `The animation used for walking.` },
        { val: "Drag", doc: `The animation used for dragging an object, only used by workers.` },
        { val: "Attack", doc: `The animation used for melee attacks.` },
        { val: "RangedAttack", doc: `The animation used for ranged attacks.` },
        { val: "CastSpell", doc: `The animation used for instant casts like self buffs.` },
        { val: "Dig", doc: `The animation used for digging and tunneling.` },
        { val: "Smoke", doc: `Imps can smoke to heal up, other units do not. It uses the 'Smoke' and 'Relax' animations.` },
        { val: "Relax", doc: `The animation used for relaxing.` },
        { val: "PrettyDance", doc: `The animation used for claiming floors and rooms, reinforcing walls.` },
        { val: "GotHit", doc: `The animation used for when the creature gets hit.` },
        { val: "PowerGrab", doc: `The animation used for dangling in the Hand of Evil.` },
        { val: "GotSlapped", doc: `Reaction to being slapped. Some creatures have animations.` },
        { val: "Celebrate", doc: `Reaction upon researching a new spell/room, manufacturing a door/trap, gaining a level or receiving gold.` },
        { val: "Sleep", doc: `The animation used for when the creature sleeps in its lair.` },
        { val: "EatChicken", doc: `The animation used for when the creature eats.` },
        { val: "Torture", doc: `The animation used for being tortured. 48 is generic.` },
        { val: "Scream", doc: `The animation used for moaning, when assigned to a job it cannot do or in prison.` },
        { val: "DropDead", doc: `The animation used for dying/unconscious. Last frame is the dead body.` },
        { val: "DeadSplat", doc: `Gib animation (from meteor/freeze). All creatures use 946.` },
        { val: "Roar", doc: `The animation used for when the creature is going mad psycho.` },
        { val: "QuerySymbol", doc: `Creature portrait. So an image, not a sprite/animation. Numbers from gui1.` },
        { val: "HandSymbol", doc: `Creature icon. So an image, not a sprite/animation. Numbers from gui2.` },
        { val: "Piss", doc: `The animation used for when the creature is pissing on corpses.` },
        { val: "Custom", doc: `For use with instances with animation set to 'CUSTOM'.` },
        { val: "Foot", doc: `The first value is the index and the second value is the count. The sound used for footsteps.` },
        { val: "Hit", doc: `The sound used for hitting.` },
        { val: "Happy", doc: `The sound used for celebrating.` },
        { val: "Sad", doc: `The sound used for moaning.` },
        { val: "Hurt", doc: `The sound used for getting hurt.` },
        { val: "Die", doc: `The sound used for dying.` },
        { val: "Hang", doc: `The sound used for being grabbed by the hand.` },
        { val: "Drop", doc: `The sound used for being dropped by the hand.` },
        { val: "Torture", doc: `The sound used for being tortured.` },
        { val: "Slap", doc: `The sound used for being slapped.` },
        { val: "Fight", doc: `The sound used for fighting.` },
        { val: "Piss", doc: `The sound used for pissing.` }
    ],
    [ParamType.Rule]: [
        { val: "ALWAYS", doc: "all creatures match this rule until it is disabled or overridden", },
        { val: "AGE_LOWER", doc: "only creatures whose time in dungeon (age) is lower than [param] match this rule", },
        { val: "AGE_HIGHER", doc: "only creatures whose time in dungeon (age) is higher than [param] match this rule", },
        { val: "LEVEL_LOWER", doc: "only creatures of level lower than [param] match this rule", },
        { val: "LEVEL_HIGHER", doc: "only creatures of level higher than [param] match this rule", },
        { val: "AT_ACTION_POINT", doc: "only creatures within action point [param] radius match this rule", },
        { val: "AFFECTED_BY", doc: "only creatures affected by the spell in [param] match this rule" },
        { val: "WANDERING", doc: "only wandering creatures match this rule", },
        { val: "WORKING", doc: "only working creatures match this rule", },
        { val: "FIGHTING", doc: "only fighting creatures match this rule", },
        { val: "DROPPED_TIME_HIGHER", doc: "only creatures picked up and dropped more turns ago match this rule", },
        { val: "DROPPED_TIME_LOWER", doc: "only creatures picked up and dropped less turns ago match this rule", },
    ],
    [ParamType.RuleAction]: [
        { val: "ALLOW" },
        { val: "DENY" },
        { val: "ENABLE" },
        { val: "DISABLE" },
    ],
    [ParamType.RuleSlot]: [
        { val: "RULE0" },
        { val: "RULE1" },
        { val: "RULE2" },
        { val: "RULE3" },
        { val: "RULE4" },
        { val: "RULE5" },
        { val: "RULE6" },
        { val: "RULE7" },
    ],
    [ParamType.GameRule]: [
        { val: "GoldPerGoldBlock", doc: "Amount of gold stored in undigged vein slab." },
        { val: "PotOfGoldHolds", doc: "Amount of gold stored in pots at start of level." },
        { val: "ChestGoldHold", doc: "Amount of gold stored in chests at start of level." },
        { val: "BagGoldHold", doc: "Amount of gold stored in bags at start of level." },
        { val: "GoldPileValue", doc: "Amount of gold stored in piles at start of level." },
        { val: "GoldPileMaximum", doc: "Max gold per pile" },
        { val: "GoldPerHoard", doc: "Max amount of gold stored in gold hoard in treasury." },
        { val: "FoodLifeOutOfHatchery" },
        { val: "DisplayPortalLimit", doc: "Shows how many creatures the player can attract through the portal in query screen. 0: disable - 1: enable." },
        { val: "DoubleClickSpeed" },
        { val: "BoulderReduceHealthSlap" },
        { val: "BoulderReduceHealthWall" },
        { val: "BoulderReduceHealthRoom" },
        { val: "GemEffectiveness", doc: "Gold mining speed from gems, in percentage compared to mining gold blocks." },
        { val: "PayDayGap", doc: "Game turns between pay days." },
        { val: "PayDaySpeed", doc: "How fast pay day comes percentage." },
        { val: "SlabCollapseTime" },
        { val: "DungeonHeartHealTime", doc: "How many game turns between the heart recovering health." },
        { val: "DungeonHeartHealHealth", doc: "How much health the heart recovers. Or loses when negative." },
        { val: "HeroDoorWaitTime" },
        { val: "RoomSellGoldBackPercent" },
        { val: "DoorSellValuePercent" },
        { val: "TrapSellValuePercent" },
        { val: "TorturePayday", doc: "Torturing a creature changes the salary for its kind, value is a percentage, 100 for no change." },
        { val: "TortureTrainingCost", doc: "Torturing a creature changes the cost of training for its kind, value is a percentage, 100 for no change." },
        { val: "TortureScavengingCost", doc: "Torturing a creature changes the cost of scavenging for its kind, value is a percentage, 100 for no change." },
        { val: "AlliesShareCta", doc: "Allied players cast Call to Arms for free on each others land." },
        { val: "AlliesShareDrop", doc: "Allied players can drop units on each others land." },
        { val: "AlliesShareVision", doc: "Allied players share map vision, which is removed as soon as alliance is broken." },
        { val: "MaxThingsInHand" },
        { val: "GlobalAmbientLight", doc: "Global light strength and dynamic lighting (32 is full bright)." },
        { val: "LightEnabled" },
        { val: "EasterEggSpeechChance", doc: "Easter Egg Game Speech Frequency. Chance is 1 in <x>. Interval is turns between rolls." },
        { val: "EasterEggSpeechInterval" },
        { val: "PreserveClassicBugs", doc: "Re-enable bugs long fixed in KeeperFX. Useful for old maps." },
        { val: "DiseaseHPTemplePercentage", doc: "Maximum health percentage when creatures are considered to be put to temple to cure of disease." },
        { val: "RecoveryFrequency" },
        { val: "FightMaxHate" },
        { val: "FightBorderline" },
        { val: "FightMaxLove" },
        { val: "BodyRemainsFor" },
        { val: "FightHateKillValue" },
        { val: "FleeZoneRadius" },
        { val: "GameTurnsInFlee" },
        { val: "GameTurnsUnconscious" },
        { val: "StunEvilEnemyChance", doc: "Chance enemy creature gets stunned for prison, when possible, 0~100." },
        { val: "StunGoodEnemyChance", doc: "Chance enemy hero gets stunned for prison, when possible, 0~100." },
        { val: "CriticalHealthPercentage", doc: "Amount of health below which the creature ignores its other needs, except hunger and immediately goes to lair to heal itself, 0~99." },
        { val: "HoldAudienceTime" },
        { val: "ArmageddonTeleportYourTimeGap" },
        { val: "ArmageddonTeleportEnemyTimeGap" },
        { val: "ArmageddonTeleportNeutrals" },
        { val: "ArmageddonCountDown" },
        { val: "ArmageddonDuration" },
        { val: "DiseaseTransferPercentage" },
        { val: "DiseaseLosePercentageHealth" },
        { val: "DiseaseLoseHealthTime", doc: "Turns between health drop due to disease, 1~255." },
        { val: "MinDistanceForTeleport" },
        { val: "CollapseDungeonDamage" },
        { val: "TurnsPerCollapseDungeonDamage" },
        { val: "FriendlyFightAreaRangePercent", doc: "Recommended value is 0~100, where 100 is the value which makes friendly and enemy fire equal." },
        { val: "FriendlyFightAreaDamagePercent", doc: "Recommended value is 0~100, where 100 is the value which makes friendly and enemy fire equal." },
        { val: "WeightCalculatePush", doc: "Set it to 600 and a creature with 300 weight will only get blown half as far as normal." },
        { val: "ScavengeCostFrequency" },
        { val: "ScavengeGoodAllowed", doc: "Whether creatures on level which belong to good player can be scavenged, 0/1." },
        { val: "ScavengeNeutralAllowed", doc: "Whether creatures on level which belong to neutral player can be scavenged, 0/1." },
        { val: "TempleScavengeProtectionTime", doc: "Amount of game turns a creature which was praying is protected from enemy scavenging after leaving the temple, 0~10000000." },
        { val: "TrainCostFrequency" },
        { val: "TrainingRoomMaxLevel", doc: "Max level the training room can be used to train to. Set to 0 for no limit." },
        { val: "TortureDeathChance", doc: "This defines the probability of death, 0~100." },
        { val: "TortureConvertChance", doc: "This defines the probability of converting and ending the torture, 0~100." },
        { val: "TimeBetweenPrisonBreak", doc: "This defines the amount of game turns between a chance for breaking from jail 1~10000000." },
        { val: "TimeSpentInPrisonWithoutBreak", doc: "How long a creature must continously sit in jail to start getting break chances." },
        { val: "PrisonBreakChance", doc: "The chance of breaking from a prison, if all conditions towards the break are met." },
        { val: "GhostConvertChance", doc: "Chance of a dying torture victim becoming undead, 0~100." },
        { val: "DefaultGenerateSpeed", doc: "For when the entrance generation speed is not set on map script, takes this value." },
        { val: "DefaultMaxCreaturesGenerateEntrance", doc: "For when max creature is not set on map script, takes this value." },
        { val: "BarrackTime" },
        { val: "BarrackMaxPartySize" },
        { val: "FoodGenerationSpeed" },
        { val: "PrisonSkeletonChance", doc: "Prisoner becoming skeleton chance, 0~100." },
        { val: "BodiesForVampire" },
        { val: "GraveyardConvertTime" },
        { val: "HitsPerSlab", doc: "which have to be depleted for the room to be taken over by enemy diggers." },
        { val: "ImpJobNotSoClose" },
        { val: "ImpJobFarAway" },
        { val: "ImpGenerateTime" },
        { val: "ImproveArea" },
        { val: "DefaultImpDigDamage", doc: "Damage did by Imp while digging - to its own slabs, and other slabs." },
        { val: "DefaultImpDigOwnDamage" },
        { val: "PerImpGoldDigSize" },
        { val: "ImpWorkExperience", doc: "Experience imps gain from working." },
        { val: "HungerHealthLoss" },
        { val: "GameTurnsPerHungerHealthLoss" },
        { val: "FoodHealthGain" },
        { val: "PrisonHealthGain" },
        { val: "GameTurnsPerPrisonHealthGain" },
        { val: "TortureHealthLoss" },
        { val: "GameTurnsPerTortureHealthLoss" },
        { val: "DragUnconsciousToLair", doc: "Imps will save fainted units by dragging them to lair: 0 = Cannot save own units, default. 1 = Imps save only own unconscious creatures with a lair. 2 = Imps save all of your own unconscious creatures with a lair and all who are capable of building one, and drag them to the correct position." },
        { val: "MapCreatureLimit", },
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
        {
            val: "4",
            doc: "Pressure activated (subtile)"
        },
        {
            val: "5",
            doc: "Whenever after reloading"
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
        { val: "NameTextID", doc: `Language-specific name of the door, as index in translation strings file.` },
        { val: "TooltipTextID", doc: `Language-specific description of the door, shown as tooltip.` },
        { val: "SymbolSprites", doc: `Sprite with big size and medium size icon of the door.` },
        { val: "PointerSprites", doc: `Sprite for mouse, used when placing the door.` },
        { val: "PanelTabIndex", doc: `Position of the door in the panel, 0 is hidden, 1-16 first page, 17-32 second page. Place in 4x4 grid.` },
        { val: "Crate", doc: `Crate object model which stores this door before it is deployed.` },
        { val: "ManufactureLevel", doc: `Number of workshop tiles needed in dungeon to build door. 0: Any workshop. 1: 10 or more. 2: 17 or more. 3: 26 or more. 4: 37 or more.` },
        { val: "ManufactureRequired", doc: `Amount of workshop points it takes to create it. See creature workshop skill.` },
        { val: "Health", doc: `Amount of hit points the door have.` },
        { val: "SlabKind", doc: `Slabs used for the door, first is horizontal and second is vertical.` },
        { val: "OpenSpeed", doc: `Self-explanatory, but setting the value too low may cause issues with creatures getting stuck while waiting for the door to open.` },
        { val: "Properties", doc: `Special properties of door - options: SECRET Hidden to enemies, but can be spotted when looking closely, or when your own units open it with the enemy looking. THICK this door is 3 subtiles thick instead of the normal 1. RESIST_NON_MAGIC if it receives damage from non magical source only 12.5% get applied. MIDAS takes gold from owner before it takes damage. One gold prevents the base HP worth of damage.` },
        { val: "SellingValue", doc: `Gold revenue when selling this door.` },
        { val: "Unsellable", doc: `Will make it impossible to sell.` },
        { val: "PlaceSound", doc: `Index of the sound to play when placing the door.` }
    ],
    [ParamType.ObjectConfig]: [
        { val: "Genre", doc: `Genre determines how units interact with the object.` },
        { val: "AnimationID", doc: `The sprite number or custom sprite name that sets the looks.` },
        { val: "AnimationSpeed", doc: `When the object has an animation, how fast it goes.` },
        { val: "Size_XY", doc: `If you can interact with the object, the floorspace of the hitbox.` },
        { val: "Size_Z", doc: `If you can interact with the object, the height of the hitbox.` },
        { val: "MaximumSize", doc: `` },
        { val: "DestroyOnLava", doc: `If the object gets destroyed when touching lava.` },
        { val: "DestroyOnLiquid", doc: `If the object gets destroyed when touching water.` },
        { val: "Health", doc: `The hitpoints of the object.` },
        { val: "FallAcceleration", doc: `The speed to which it falls. Set to 0 to make it float.` },
        { val: "LightUnaffected", doc: `If it changes brightness when a light shines on it. 0: disabled:, 1: enabled.` },
        { val: "LightIntensity", doc: `The light the object gives off. 0~255.` },
        { val: "LightRadius", doc: `The range of the light in subtiles. 0~255.` },
        { val: "LightFlags", doc: `Unknown light properties. Possible flag values 0~255, where powers of 2 are unique properties.` },
        { val: "LightIsDynamic", doc: `The type of light. 0: disabled, 1: enabled.` },
        { val: "MapIcon", doc: `The icon that represents the icon on the map. -1 is used for custom.` },
        { val: "AmbienceSound", doc: `Sound played when within hearing range in possession.` },
        { val: "RandomStartFrame", doc: `Randomizes the frame at wich each anim starts, so multiple objects don't all make the same movement at same time.` },
        { val: "DrawClass", doc: `How the object is rendered. Default is 2.` },
        { val: "TransparencyFlags", doc: `Makes object transparant in different ways. Range: 0~3, where 3 is both 1 and 2 together.` },
        { val: "Persistence", doc: `What happens to the object when the slab is reordered. 1: Delete when no space, 2: Always Keep, 3: Always Delete.` },
        { val: "FlameAnimationID", doc: `Sprite number for a secondary sprite drawn on top of the first one` },
        { val: "FlameAnimationSpeed", doc: `The speed of the flame animation` },
        { val: "FlameAnimationSize", doc: `The size of the secondary sprite. Assume 300 is a normal size.` },
        { val: "FlameAnimationOffset", doc: `Position of the secondary sprite compared to the first one. First x,y for possession, then x,y in normal view.` },
        { val: "FlameTransparencyFlags", doc: `Flame can have a different transparency from main object.` },
        { val: "Immobile", doc: `` },
        { val: "InitialState", doc: `Initial state, only used for chickens.` },
        { val: "Properties", doc: `Possible properties: EXISTS_ONLY_IN_ROOM, DESTROYED_ON_ROOM_CLAIM, CHOWNED_ON_ROOM_CLAIM, DESTROYED_ON_ROOM_PLACE, BUOYANT, BEATING, HEART.` },
        { val: "UpdateFunction", doc: `Function that should be executed to update the object. UPDATE_DUNGEON_HEART, UPDATE_CALL_TO_ARMS, UPDATE_ARMOUR, UPDATE_OBJECT_SCALE, UPDATE_POWER_SIGHT, UPDATE_POWER_LIGHTNING, NULL.` }
    ],
    [ParamType.TrapConfig]: [
        { val: "TooltipTextID", doc: `Language-specific description of the trap, shown as tooltip.` },
        { val: "SymbolSprites", doc: `Sprite with big size and medium size icon of the trap.` },
        { val: "PointerSprites", doc: `Sprite for mouse, used when placing the trap.` },
        { val: "PanelTabIndex", doc: `Position of the trap in the panel, 0 is hidden, 1-16 first page, 17-32 second page. Place in 4x4 grid.` },
        { val: "Crate", doc: `Crate object model which stores this trap before it is deployed.` },
        { val: "ManufactureLevel", doc: `Number of workshop tiles needed in dungeon to build trap. 0: Any workshop. 1: 10 or more. 2: 17 or more. 3: 26 or more. 4: 37 or more.` },
        { val: "ManufactureRequired", doc: `Amount of workshop points it takes to create it. See creature workshop skill.` },
        { val: "Shots", doc: `How many time a trap can trigger. Set at 255 for infinite shots.` },
        { val: "TimeBetweenShots", doc: `Delay in game turns between each shot.` },
        { val: "InitialDelay", doc: `If set the trap is on 'reloading phase' at placement, value defines how long in game turns before it can start shooting.` },
        { val: "TriggerType", doc: `How to trigger the trap. 1: Line of sight 90 degrees. 2: Pressure activated (tile). 3: Line of sight. 4: Pressure activated (subtile). 5: Whenever after reloading.` },
        { val: "ActivationType", doc: `Type of effect on activation. 1: Trap shot head for target. 2: Trap effect. 3: Trap shot stay on trap. 4: Change the slab into another slab type. 5: Shoot like a creature would. 6: Spawns a creature, at level 1. 7: Keeper spell.` },
        { val: "EffectType", doc: `The shot/effect/slab/creature/keeper power, based on the Activation Type. Accepts both names and numbers.` },
        { val: "HitType", doc: `Controls which things will be affected by the AreaDamage of the spell (1~8), see magic.cfg.` },
        { val: "Hidden", doc: `If the trap is visible before getting triggered.` },
        { val: "Slappable", doc: `Can the trap be triggered by activating it. Set to 1 to activate by slap, set to 2 to make it target nearest enemy in range on slap.` },
        { val: "DetectInvisible", doc: `Allows the trap to be triggered by invisible creatures.` },
        { val: "TriggerAlarm", doc: `Will there be an event message when the trap is triggered.` },
        { val: "PlaceOnBridge", doc: `If set to 1 allows the trap to be placed on bridges.` },
        { val: "PlaceOnSubtile", doc: `If set to 1 allows the trap to be placed anywhere on a slab. This results in up to 9 traps per tile.` },
        { val: "FlagNumber", doc: `Set to a number between 0 and 255 and it will increment scriptflag TRAP#_ACTIVATED when triggered, with # being the value.` },
        { val: "InstantPlacement", doc: `Place the trap immediately without needing imps to drag the crate to arm it.` },
        { val: "RemoveOnceDepleted", doc: `Destroy the trap once it runs out of Shots.` },
        { val: "Health", doc: `Amount of hit points the trap have.` },
        { val: "Destructible", doc: `Can the trap be destroyed by attacking it. If 1 it can by any attack, 0 only by units with 'DISARM ability', -1 by nobody.` },
        { val: "Unstable", doc: `Will the trap trigger a shot when destroyed. If 0 it will not, 1 it will when attacked, 2 it even will when disarmed.` },
        { val: "DestroyedEffect", doc: `Effect shown upon destruction of the trap if destructible was enabled. Takes the name of the effect or effect element, see 'effects.toml'.` },
        { val: "ThingSize", doc: `The size of the hitbox of the trap, floorspace and height.` },
        { val: "AnimationID", doc: `The ID of the sprite used for the animation.` },
        { val: "AttackAnimationID", doc: `The ID for the animation as the trap triggers.` },
        { val: "RechargeAnimationID", doc: `The ID of trap while it cannot shoot yet for because it just shot. Leave at 0 to use AnimationID.` },
        { val: "ModelSize", doc: `` },
        { val: "AnimationSpeed", doc: `` },
        { val: "Unanimated", doc: `Unanimated means the Model animation does not loop.` },
        { val: "Unshaded", doc: `` },
        { val: "RandomStartFrame", doc: `` },
        { val: "LightRadius", doc: `` },
        { val: "LightIntensity", doc: `` },
        { val: "LightFlags", doc: `` },
        { val: "TransparencyFlags", doc: `Makes object transparent in different ways. Range: 0~3, where 3 is both 1 and 2 together.` },
        { val: "ShotOrigin", doc: `Place where a shot fired by the trap originates, relative to trap position.` },
        { val: "ShotVector", doc: `Direction or magnitude of the shot fired by the trap.` },
        { val: "FlameAnimationID", doc: `Sprite number for a secondary sprite drawn on top of the first one. Not shown on depleted traps.` },
        { val: "FlameAnimationSpeed", doc: `The speed of the flame animation.` },
        { val: "FlameAnimationSize", doc: `The size of the secondary sprite. Assume 300 is a normal size.` },
        { val: "FlameAnimationOffset", doc: `Position of the secondary sprite compared to the first one. First x-y for possession, then x-y in normal view.` },
        { val: "FlameTransparencyFlags", doc: `Flame can have a different transparency from main object.` },
        { val: "SellingValue", doc: `Gold revenue when selling this trap.` },
        { val: "Unsellable", doc: `Will make it impossible to sell.` },
        { val: "PlaceSound", doc: `Index of the sound to play when placing the trap.` },
        { val: "TriggerSound", doc: `Index of the sound to play when trap is triggered.` }
    ],
    [ParamType.PowerConfig]: [
        { val: "TooltipTextID", doc: `Language-specific description of the item, shown as tooltip.` },
        { val: "SymbolSprites", doc: `Sprite with big size and medium size icon of the item.` },
        { val: "PointerSprites", doc: `Sprite for mouse, used when placing the item.` },
        { val: "PanelTabIndex", doc: `Position of the power in the panel, 0 is hidden, 1-16 first page, 17-32 second page. Place in 4x4 grid.` },
        { val: "SoundSamples", doc: `Sound sample played when selecting the power.` },
        { val: "SoundPlayed", doc: `Sound sample played when casting the power.` },
        { val: "Power", doc: `Power strength at each overload level. Final level only used by creatures.` },
        { val: "Cost", doc: `Power cost at each overload level.` },
        { val: "CostFormula", doc: `Special formulas for the cost. NONE, DIGGER, DWARF. Default to NONE.` },
        { val: "Duration", doc: `How long the power remains in effect in game turns.` },
        { val: "Cooldown", doc: `How long after the power is used the player has to wait to cast again. Only for powers that need a delay.` },
        { val: "Castability", doc: `Where the power can be casted. Some map-related options are: UNREVEALED - normally powers can be casted only on terrain revealed by player, this overrides that restriction. REVEALED_TEMP - allow casting on temporarily-revealed tiles, ie. by sight of evil. CLAIMABLE - don't allow to cast on tiles which can't be claimed, ie. water, lava, rock. ALL_TALL - allow casting the spell on all tall terrain types, ie. wall, gold, rock. NEUTRL_TALL - allow casting the spell on tall terrain types owned by neutral player, including unowned. OWNED_TALL - allow casting the spell on tall terrain types owned by casting player. ALLIED_TALL - allow casting the spell on tall terrain types owned by allied players. ENEMY_TALL - allow casting the spell on tall terrain types owned by enemy players. ALL_GROUND - allow casting the spell on all ground-level terrain types, ie. path, water, lava, claimed ground. UNCLMD_GROUND - allow casting the spell on natural ground-level terrain types, ie. path, water, lava. NEUTRL_GROUND - allow casting the spell on constructed ground-level terrain types owned by neutral player, ie. claimed ground, rooms. OWNED_GROUND - allow casting the spell on constructed ground-level terrain types owned by casting player. ALLIED_GROUND - allow casting the spell on constructed ground-level terrain types owned by allied players. ENEMY_GROUND - allow casting the spell on constructed ground-level terrain types owned by enemy players. ANYWHERE - allow casting the spell on any revealed area, this overrides all map-related options other than 'UNREVEALED' and 'REVEALED_TEMP'. Besides map-related options, there are thing-related ones. If at least one thing-related option is present, then spell can only be casted if both map-related and thing-related conditions are met, unless an additional option is present: THING_OR_MAP - makes it that only one of map-related and thing-related condition groups has to be met. Some of thing-related conditions are: CUSTODY_CRTRS - allow casting on creatures being held in custody. OWNED_CRTRS - allow casting on players own creatures. ALLIED_CRTRS - allow casting on creatures belonging to allied players. ENEMY_CRTRS - allow casting on creatures owned by enemy players. BOUND_CRTRS - allow casting on creatures being affected by Armageddon and Teleport, those who are dragging, leaving or being sacrificed, allowing this may have bad side effects. ONLY_DIGGERS - can only be cast on special diggers. NO_DIGGERS   - can only be cast on creatures that are not special diggers. Miscellaneous: NEEDS_DELAY - Requires a delay defined with 'Cooldown' in game turns before it can be cast again.` },
        { val: "Artifact", doc: `Artifact object which represents the power, usually a spellbook.` },
        { val: "Properties", doc: `Property flags of the power.` },
        { val: "PlayerState", doc: `Player state change when power icon is clicked.` },
        { val: "ParentPower", doc: `Power which aggregates the current power, if set to existing power, makes current power part of a cast.` },
        { val: "CastExpandFunc", doc: `Functions used to implement the power.` },
        { val: "UseFunction", doc: `` }
    ],
    [ParamType.PowerConfigCastability]: [ // this is unused. text is used instead because it supports multiple entities inside text. type checking and hinting inside texts are not supported yet
        {
            val: "UNREVEALED",
            doc: "normally powers can be casted only on terrain revealed by player; this overrides that restriction",
        },
        {
            val: "REVEALED_TEMP",
            doc: "allow casting on temporarily-revealed tiles (ie. by sight of evil)",
        },
        {
            val: "CLAIMABLE",
            doc: "don't allow to cast on tiles which can't be claimed (ie. water, lava, rock)",
        },
        {
            val: "ALL_TALL",
            doc: "allow casting the spell on all tall terrain types (ie. wall, gold, rock)",
        },
        {
            val: "NEUTRL_TALL",
            doc: "allow casting the spell on tall terrain types owned by neutral player, including unowned",
        },
        {
            val: "OWNED_TALL",
            doc: "allow casting the spell on tall terrain types owned by casting player",
        },
        {
            val: "ALLIED_TALL",
            doc: "allow casting the spell on tall terrain types owned by allied players",
        },
        {
            val: "ENEMY_TALL",
            doc: "allow casting the spell on tall terrain types owned by enemy players",
        },
        {
            val: "ALL_GROUND",
            doc: "allow casting the spell on all ground-level terrain types (ie. path, water, lava, claimed ground)",
        },
        {
            val: "UNCLMD_GROUND",
            doc: "allow casting the spell on natural ground-level terrain types (path, water, lava)",
        },
        {
            val: "NEUTRL_GROUND",
            doc: "allow casting the spell on constructed ground-level terrain types owned by neutral player (claimed ground, rooms)",
        },
        {
            val: "OWNED_GROUND",
            doc: "allow casting the spell on constructed ground-level terrain types owned by casting player",
        },
        {
            val: "ALLIED_GROUND",
            doc: "allow casting the spell on constructed ground-level terrain types owned by allied players",
        },
        {
            val: "ENEMY_GROUND",
            doc: "allow casting the spell on constructed ground-level terrain types owned by enemy players",
        },
        {
            val: "ANYWHERE",
            doc: "allow casting the spell on any revealed area; this overrides all map-related options other than UNREVEALED and REVEALED_TEMP",
        },
        {
            val: "THING_OR_MAP",
            doc: "makes it that only one of map-related and thing-related condition groups has to be met",
        },
        {
            val: "CUSTODY_CRTRS",
            doc: "allow casting on creatures being held in custody",
        },
        {
            val: "OWNED_CRTRS",
            doc: "allow casting on players own creatures",
        },
        {
            val: "ALLIED_CRTRS",
            doc: "allow casting on creatures belonging to allied players",
        },
        {
            val: "ENEMY_CRTRS",
            doc: "allow casting on creatures owned by enemy players",
        },
        {
            val: "BOUND_CRTRS",
            doc: "allow casting on creatures being affected by Armageddon and Teleport; but also those who are dragging, leaving or being sacrificed; allowing this may have bad side effects",
        },
        {
            val: "ONLY_DIGGERS",
            doc: "can only be cast on special diggers",
        },
        {
            val: "NO_DIGGERS",
            doc: "can only be cast on creatures that are not special diggers",
        },
        {
            val: "NEEDS_DELAY",
            doc: "can't be cast while casting powers is on cooldown.",
        },
    ],
    [ParamType.PowerLvl]: new Array(9).fill(0).map((e, i) => ({
        val: `${i + 1}`
    })),
    [ParamType.Spell]: [
        { val: "SPELL_FREEZE", },
        { val: "SPELL_ARMOUR", },
        { val: "SPELL_REBOUND", },
        { val: "SPELL_HEAL", },
        { val: "SPELL_INVISIBILITY", },
        { val: "SPELL_TELEPORT", },
        { val: "SPELL_SPEED", },
        { val: "SPELL_SLOW", },
        { val: "SPELL_FLIGHT", },
        { val: "SPELL_SIGHT", },
        { val: "SPELL_LIGHT", },
        { val: "SPELL_DISEASE", },
        { val: "SPELL_CHICKEN", },
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
        { val: `"BUILD A TREASURE ROOM 4x4"`, },
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
        { val: "HARD", },
        { val: "GOLD", },
        { val: "DIRT", },
        { val: "TORCH_DIRT", },
        { val: "DRAPE_WALL", },
        { val: "TORCH_WALL", },
        { val: "TWINS_WALL", },
        { val: "WOMAN_WALL", },
        { val: "PAIR_WALL", },
        { val: "DAMAGED_WALL", },
        { val: "PATH", },
        { val: "PRETTY_PATH", },
        { val: "LAVA", },
        { val: "WATER", },
        { val: "ENTRANCE_ZONE", },
        { val: "ENTRANCE_WALL", },
        { val: "TREASURY_AREA", },
        { val: "TREASURY_WALL", },
        { val: "BOOK_SHELVES", },
        { val: "LIBRARY_WALL", },
        { val: "PRISON_AREA", },
        { val: "PRISON_WALL", },
        { val: "TORTURE_AREA", },
        { val: "TORTURE_WALL", },
        { val: "TRAINING_AREA", },
        { val: "TRAINING_WALL", },
        { val: "HEART_PEDESTAL", },
        { val: "HEART_WALL", },
        { val: "WORKSHOP_AREA", },
        { val: "WORKSHOP_WALL", },
        { val: "SCAVENGE_AREA", },
        { val: "SCAVENGER_WALL", },
        { val: "TEMPLE_POOL", },
        { val: "TEMPLE_WALL", },
        { val: "GRAVE_AREA", },
        { val: "GRAVE_WALL", },
        { val: "HATCHERY", },
        { val: "HATCHERY_WALL", },
        { val: "LAIR_AREA", },
        { val: "LAIR_WALL", },
        { val: "BARRACK_AREA", },
        { val: "BARRACK_WALL", },
        { val: "DOOR_WOODEN", },
        { val: "DOOR_WOODEN2", },
        { val: "DOOR_BRACE", },
        { val: "DOOR_BRACE2", },
        { val: "DOOR_STEEL", },
        { val: "DOOR_STEEL2", },
        { val: "DOOR_MAGIC", },
        { val: "DOOR_MAGIC2", },
        { val: "SLAB50", },
        { val: "BRIDGE_FRAME", },
        { val: "GEMS", },
        { val: "GUARD_AREA", },
        { val: "PURPLE_PATH", },
        { val: "DOOR_SECRET", },
        { val: "DOOR_SECRET2", },
        { val: "HARD_FLOOR", },
        { val: "DOOR_MIDAS", },
        { val: "DOOR_MIDAS2", },
    ],
    [ParamType.CustomBox]: new Array(256).fill(0).map((e, i) => ({
        val: `BOX${i}_ACTIVATED`
    })),
    [ParamType.TrapActivated]: new Array(256).fill(0).map((e, i) => ({
        val: `TRAP${i}_ACTIVATED`
    })),
    [ParamType.Object]: [
        { val: "NULL" },
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
        { val: "WRKBOX_DEMOLTN" },
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
        { val: "FERN" },
        { val: "FERN_BROWN" },
        { val: "FERN_SMALL" },
        { val: "FERN_SMALL_BROWN" },
        { val: "MUSHROOM_YELLOW" },
        { val: "MUSHROOM_GREEN" },
        { val: "MUSHROOM_RED" },
        { val: "LAIR_TMAGE" },
        { val: "LAIR_DRUID" },
        { val: "LILYPAD" },
        { val: "CATTAILS" },
        { val: "BANNER" },
        { val: "LANTERN_PST" },
        { val: "POTION_RED" },
        { val: "POTION_BROWN" },
        { val: "POTION_WHITE" },
        { val: "POTION_YELLOW" },
        { val: "ROCK_PILLAR" },
        { val: "ROCK" },
        { val: "LAVA_PILLAR" },
        { val: "LAVA_ROCK" },
        { val: "ICE_PILLAR" },
        { val: "ICE_ROCK" },
        { val: "WRKBOX_SECRET" },
        { val: "GUARDFLAG_WHITE" },
        { val: "HEARTFLAME_WHITE" },
        { val: "SPELLBOOK_RBND" },
        { val: "GUARDFLAG_PURPLE" },
        { val: "HEARTFLAME_PURPLE" },
        { val: "GUARDFLAG_BLACK" },
        { val: "HEARTFLAME_BLACK" },
        { val: "GUARDFLAG_ORANGE" },
        { val: "HEARTFLAME_ORANGE" },
        { val: "SPECBOX_HEALALL" },
        { val: "SPECBOX_GETGOLD" },
        { val: "SPECBOX_MKANGRY" },
        { val: "SPECBOX_MKUNSAFE" },
        { val: "SPELLBOOK_FRZ" },
        { val: "SPELLBOOK_SLOW" },
        { val: "SPELLBOOK_FLGT" },
        { val: "SPELLBOOK_VSN" },
        { val: "WRKBOX_MIDAS" },
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
    [ParamType.Location]: [
        {
            val: "LAST_EVENT",
            doc: "Location of the last triggered Custom Mystery box or sacrificed unit"
        },
        {
            val: "COMBAT",
            doc: "Location of the last battle"
        },
        {
            val: "CTA",
            doc: "Location of active Call to Arms spell"
        },
    ],
    [ParamType.OneToTen]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String).map(val => ({ val })),
    [ParamType.CreatureSpell]: [
        { val: "NULL", },
        { val: "FIRST_PERSON_DIG", },
        { val: "SWING_WEAPON_FIST", },
        { val: "SWING_WEAPON_SWORD", },
        { val: "SPEED", },
        { val: "TELEPORT", },
        { val: "FIRE_ARROW", },
        { val: "NAVIGATING_MISSILE", },
        { val: "SLOW", },
        { val: "ARMOUR", },
        { val: "HEAL", },
        { val: "FREEZE", },
        { val: "DRAIN", },
        { val: "INVISIBILITY", },
        { val: "WORD_OF_POWER", },
        { val: "POISON_CLOUD", },
        { val: "FART", },
        { val: "GRENADE", },
        { val: "LIGHTNING", },
        { val: "FIRE_BOMB", doc: "Meteor spell" },
        { val: "FIREBALL", },
        { val: "REBOUND", },
        { val: "SIGHT", },
        { val: "FLAME_BREATH", },
        { val: "HAILSTORM", },
        { val: "SIGHT", },
        { val: "WIND", },
        { val: "FLY", },
        { val: "LIZARD", },
        { val: "DISEASE", },
        { val: "LIGHT", },
        { val: "CAST_SPELL_TIME_BOMB", },
        { val: "CAST_SPELL_CHICKEN", },
        { val: "CAST_SPELL_DISEASE", },
        { val: "SUMMON_FAMILIAR", },
        { val: "SUMMON_CREATURE", },
        { val: "RANGED_HEAL", },
        { val: "RANGED_SPEED", },
        { val: "RANGED_ARMOUR", },
        { val: "RANGED_REBOUND", },
    ],
    [ParamType.CompareOperator]: [
        { val: ">" },
        { val: "<" },
        { val: ">=" },
        { val: "<=" },
        { val: "==" },
        { val: "!=" },
    ],
    [ParamType.CreatureGlobal]: [
        {
            val: "TOTAL_DIGGERS",
            doc: "The number of special diggers (Imps) that player has got",
        },
        {
            val: "TOTAL_CREATURES",
            doc: "The number of creatures that player has got",
        },
        {
            val: "EVIL_CREATURES",
            doc: "The number of evil creatures that player has got",
        },
        {
            val: "GOOD_CREATURES",
            doc: "The number of heroes that player has got",
        },
    ],
    [ParamType.Effect]: [
        { val: "NULL", },
        { val: "EFFECT_EXPLOSION_1", },
        { val: "EFFECT_EXPLOSION_2", },
        { val: "EFFECT_EXPLOSION_3", },
        { val: "EFFECT_EXPLOSION_4", },
        { val: "EFFECT_EXPLOSION_5", },
        { val: "EFFECT_BLOOD_HIT", },
        { val: "EFFECT_BLOOD_CHICKEN", },
        { val: "EFFECT_BLOOD_3", },
        { val: "EFFECT_BLOOD_4", },
        { val: "EFFECT_BLOOD_5", },
        { val: "EFFECT_GAS_1", },
        { val: "EFFECT_GAS_2", },
        { val: "EFFECT_GAS_3", },
        { val: "EFFECT_WORD_OF_POWER", },
        { val: "EFFECT_ICE_SHARD", },
        { val: "EFFECT_HARMLESS_GAS_1", },
        { val: "EFFECT_HARMLESS_GAS_2", },
        { val: "EFFECT_HARMLESS_GAS_3", },
        { val: "EFFECT_DRIP_1", },
        { val: "EFFECT_DRIP_2", },
        { val: "EFFECT_DRIP_3", },
        { val: "EFFECT_HIT_FROZEN_UNIT", },
        { val: "EFFECT_HAIL", },
        { val: "EFFECT_ICE_DEATH", },
        { val: "EFFECT_DIRT_RUBBLE_SMALL", },
        { val: "EFFECT_DIRT_RUBBLE", },
        { val: "EFFECT_DIRT_RUBBLE_BIG", },
        { val: "EFFECT_SPANGLE_RED", },
        { val: "EFFECT_DRIP_4", },
        { val: "EFFECT_CLOUD", },
        { val: "EFFECT_HARMLESS_GAS_4", },
        { val: "EFFECT_GOLD_RUBBLE_1", },
        { val: "EFFECT_GOLD_RUBBLE_2", },
        { val: "EFFECT_GOLD_RUBBLE_3", },
        { val: "EFFECT_TEMPLE_SPLASH", },
        { val: "EFFECT_CEILING_BREACH", },
        { val: "EFFECT_STRANGE_GAS_1", },
        { val: "EFFECT_STRANGE_GAS_2", },
        { val: "EFFECT_STRANGE_GAS_3", },
        { val: "EFFECT_GAS_SLOW_1", },
        { val: "EFFECT_GAS_SLOW_2", },
        { val: "EFFECT_GAS_SLOW_3", },
        { val: "EFFECT_ERUPTION", },
        { val: "EFFECT_ELECTRIC_BALLS", },
        { val: "EFFECT_EXPLOSION_6", },
        { val: "EFFECT_SPANGLE_RED_BIG", },
        { val: "EFFECT_COLOURFUL_FIRE_CIRCLE", },
        { val: "EFFECT_FLASH", },
        { val: "EFFECT_049", },
        { val: "EFFECT_EXPLOSION_7", },
        { val: "EFFECT_FEATHER_PUFF", },
        { val: "EFFECT_EXPLOSION_8", },
        { val: "EFFECT_RESEARCH_COMPLETE", },
        { val: "EFFECT_COLFOUNTN_1", },
        { val: "EFFECT_COLFOUNTN_2", },
        { val: "EFFECT_COLFOUNTN_3", },
        { val: "EFFECT_SPANGLE_BLUE", },
        { val: "EFFECT_SPANGLE_GREEN", },
        { val: "EFFECT_SPANGLE_YELLOW", },
        { val: "EFFECT_BALL_PUFF_RED", },
        { val: "EFFECT_BALL_PUFF_BLUE", },
        { val: "EFFECT_BALL_PUFF_GREEN", },
        { val: "EFFECT_BALL_PUFF_YELLOW", },
        { val: "EFFECT_BALL_PUFF_WHITE", },
        { val: "EFFECT_BLOOD_7", },
        { val: "EFFECT_BLOOD_FOOTSTEP", },
        { val: "EFFECTELEMENT_NULL", },
        { val: "EFFECTELEMENT_BLAST1", },
        { val: "EFFECTELEMENT_BLOOD1", },
        { val: "EFFECTELEMENT_BLOOD2", },
        { val: "EFFECTELEMENT_BLOOD3", },
        { val: "EFFECTELEMENT_UNKNOWN05", },
        { val: "EFFECTELEMENT_SPIKED_BALL", },
        { val: "EFFECTELEMENT_CLOUD1", },
        { val: "EFFECTELEMENT_SMALL_SPARKLES", },
        { val: "EFFECTELEMENT_BALL_OF_LIGHT", },
        { val: "EFFECTELEMENT_RED_FLAME_BIG", },
        { val: "EFFECTELEMENT_ICE_SHARD", },
        { val: "EFFECTELEMENT_LEAVES1", },
        { val: "EFFECTELEMENT_THINGY2", },
        { val: "EFFECTELEMENT_THINGY3", },
        { val: "EFFECTELEMENT_TINY_FLASH1", },
        { val: "EFFECTELEMENT_FLASH_BALL1", },
        { val: "EFFECTELEMENT_RED_FLASH", },
        { val: "EFFECTELEMENT_FLASH_BALL2", },
        { val: "EFFECTELEMENT_TINY_FLASH2", },
        { val: "EFFECTELEMENT_PURPLE_STARS", },
        { val: "EFFECTELEMENT_CLOUD2", },
        { val: "EFFECTELEMENT_DRIP1", },
        { val: "EFFECTELEMENT_BLOOD4", },
        { val: "EFFECTELEMENT_ICE_MELT1", },
        { val: "EFFECTELEMENT_ICE_MELT2", },
        { val: "EFFECTELEMENT_TINY_ROCK", },
        { val: "EFFECTELEMENT_MED_ROCK", },
        { val: "EFFECTELEMENT_LARGE_ROCK1", },
        { val: "EFFECTELEMENT_DRIP2", },
        { val: "EFFECTELEMENT_LAVA_FLAME_STATIONARY", },
        { val: "EFFECTELEMENT_WATERDROP", },
        { val: "EFFECTELEMENT_LAVA_FLAME_MOVING", },
        { val: "EFFECTELEMENT_LARGE_ROCK2", },
        { val: "EFFECTELEMENT_UNKNOWN34", },
        { val: "EFFECTELEMENT_UNKNOWN35", },
        { val: "EFFECTELEMENT_UNKNOWN36", },
        { val: "EFFECTELEMENT_ENTRANCE_MIST", },
        { val: "EFFECTELEMENT_SPLASH", },
        { val: "EFFECTELEMENT_BLAST2", },
        { val: "EFFECTELEMENT_DRIP3", },
        { val: "EFFECTELEMENT_PRICE", },
        { val: "EFFECTELEMENT_ELECTRIC_BALL1", },
        { val: "EFFECTELEMENT_RED_TWINKLE", },
        { val: "EFFECTELEMENT_RED_TWINKLE2", },
        { val: "EFFECTELEMENT_HEAL", },
        { val: "EFFECTELEMENT_UNKNOWN46", },
        { val: "EFFECTELEMENT_CLOUD3", },
        { val: "EFFECTELEMENT_LARGE_ROCK3", },
        { val: "EFFECTELEMENT_GOLD1", },
        { val: "EFFECTELEMENT_GOLD2", },
        { val: "EFFECTELEMENT_GOLD3", },
        { val: "EFFECTELEMENT_FLASH", },
        { val: "EFFECTELEMENT_ELECTRIC_BALL2", },
        { val: "EFFECTELEMENT_RED_PUFF", },
        { val: "EFFECTELEMENT_RED_FLAME", },
        { val: "EFFECTELEMENT_BLUE_FLAME", },
        { val: "EFFECTELEMENT_GREEN_FLAME", },
        { val: "EFFECTELEMENT_YELLOW_FLAME", },
        { val: "EFFECTELEMENT_CHICKEN", },
        { val: "EFFECTELEMENT_ELECTRIC_BALL3", },
        { val: "EFFECTELEMENT_FEATHERS", },
        { val: "EFFECTELEMENT_UNKNOWN62", },
        { val: "EFFECTELEMENT_WHITE_SPARKLES_SMALL", },
        { val: "EFFECTELEMENT_GREEN_SPARKLES_SMALL", },
        { val: "EFFECTELEMENT_RED_SPARKLES_SMALL", },
        { val: "EFFECTELEMENT_BLUE_SPARKLES_SMALL", },
        { val: "EFFECTELEMENT_WHITE_SPARKLES_MED", },
        { val: "EFFECTELEMENT_GREEN_SPARKLES_MED", },
        { val: "EFFECTELEMENT_RED_SPARKLES_MED", },
        { val: "EFFECTELEMENT_BLUE_SPARKLES_MED", },
        { val: "EFFECTELEMENT_WHITE_SPARKLES_LARGE", },
        { val: "EFFECTELEMENT_GREEN_SPARKLES_LARGE", },
        { val: "EFFECTELEMENT_RED_SPARKLES_LARGE", },
        { val: "EFFECTELEMENT_BLUE_SPARKLES_LARGE", },
        { val: "EFFECTELEMENT_RED_SMOKE_PUFF", },
        { val: "EFFECTELEMENT_BLUE_SMOKE_PUFF", },
        { val: "EFFECTELEMENT_GREEN_SMOKE_PUFF", },
        { val: "EFFECTELEMENT_YELLOW_SMOKE_PUFF", },
        { val: "EFFECTELEMENT_BLUE_PUFF", },
        { val: "EFFECTELEMENT_GREEN_PUFF", },
        { val: "EFFECTELEMENT_YELLOW_PUFF", },
        { val: "EFFECTELEMENT_WHITE_PUFF", },
        { val: "EFFECTELEMENT_RED_TWINKLE3", },
        { val: "EFFECTELEMENT_THINGY4", },
        { val: "EFFECTELEMENT_BLOOD_SPLAT", },
        { val: "EFFECTELEMENT_BLUE_TWINKLE", },
        { val: "EFFECTELEMENT_GREEN_TWINKLE", },
        { val: "EFFECTELEMENT_YELLOW_TWINKLE", },
        { val: "EFFECTELEMENT_CLOUD_DISPERSE", },
        { val: "EFFECTELEMENT_BLUE_TWINKE2", },
        { val: "EFFECTELEMENT_GREEN_TWINKLE2", },
        { val: "EFFECTELEMENT_YELLOW_TWINKLE2", },
        { val: "EFFECTELEMENT_RED_DOT", },
        { val: "EFFECTELEMENT_ICE_MELT3", },
        { val: "EFFECTELEMENT_DISEASE_FLY", },
        { val: "EFFECTELEMENT_WHITE_TWINKLE", },
        { val: "EFFECTELEMENT_WHITE_TWINKLE2", },
        { val: "EFFECTELEMENT_WHITE_FLAME", },
        { val: "EFFECTELEMENT_WHITE_SMOKE_PUFF", },
        { val: "EFFECTELEMENT_GOLD_COIN", },
        { val: "EFFECTELEMENT_STEP_GYPSUM", },
        { val: "EFFECTELEMENT_STEP_SAND", },
        { val: "EFFECTELEMENT_TINY_FLASH3", },
        { val: "EFFECTELEMENT_ORANGE_PUFF", },
        { val: "EFFECTELEMENT_ORANGE_TWINKLE2", },
        { val: "EFFECTELEMENT_ORANGE_TWINKLE", },
        { val: "EFFECTELEMENT_ORANGE_SMOKE_PUFF", },
        { val: "EFFECTELEMENT_ORANGE_FLAME", },
        { val: "EFFECTELEMENT_BLACK_PUFF", },
        { val: "EFFECTELEMENT_BLACK_TWINKLE2", },
        { val: "EFFECTELEMENT_BLACK_TWINKLE", },
        { val: "EFFECTELEMENT_BLACK_SMOKE_PUFF", },
        { val: "EFFECTELEMENT_BLACK_FLAME", },
        { val: "EFFECT_SPANGLE_MULTICOLOURED", },
        { val: "EFFECT_BOULDER_BREAK_WATER", },
        { val: "EFFECT_SPANGLE_WHITE", },
        { val: "EFFECT_SPANGLE_PURPLE", },
        { val: "EFFECT_BALL_PUFF_PURPLE", },
        { val: "EFFECT_SPANGLE_BLACK", },
        { val: "EFFECT_BALL_PUFF_BLACK", },
        { val: "EFFECT_SPANGLE_ORANGE", },
        { val: "EFFECT_BALL_PUFF_ORANGE", },
        { val: "EFFECT_FALLING_ICE_BLOCKS", },
        { val: "EFFECT_SLOW_KEEPER_POWER", },
        { val: "EFFECT_TINY_SPARKS", },
        { val: "EFFECT_COIN_FOUNTAIN", },
    ],
    [ParamType.EffectGenerator]: [
        { val: "EFFECTGENERATOR_LAVA", },
        { val: "EFFECTGENERATOR_DRIPPING_WATER", },
        { val: "EFFECTGENERATOR_ROCK_FALL", },
        { val: "EFFECTGENERATOR_ENTRANCE_ICE", },
        { val: "EFFECTGENERATOR_DRY_ICE", },
    ],
    [ParamType.EffectGeneratorProperty]: [
        { val: "GenerationDelayMin", },
        { val: "GenerationDelayMax", },
        { val: "GenerationAmount", },
        { val: "EffectModel", },
        { val: "IgnoreTerrain", },
        { val: "SpawnHeight", },
        { val: "AccelerationMin", },
        { val: "AccelerationMax", },
        { val: "Sound", },
    ],
    [ParamType.AllianceType]: [
        {
            val: "0",
            doc: "Players are enemies, but may change that. Computer Players never will.",
        },
        {
            val: "1",
            doc: "Players are allied, but may change that. Computer Players never will.",
        },
        {
            val: "2",
            doc: "Players are enemies, and cannot change this.",
        },
        {
            val: "3",
            doc: "Players are allied, and cannot change this.",
        },
    ],
    [ParamType.Job]: [
        { val: "NULL", doc: "Empty job, indicates no job assigned", },
        { val: "TUNNEL", doc: "Tunneling", },
        { val: "DIG", doc: "Digging", },
        { val: "RESEARCH", doc: "Researching rooms and spells in the library", },
        { val: "TRAIN", doc: "Training job", },
        { val: "MANUFACTURE", doc: "Manufacturing traps and doors in workshop", },
        { val: "SCAVENGE", doc: "Scavenging enemy and neutral creatures to join the player", },
        { val: "KINKY_TORTURE", doc: "Torture for pleasure, with no health loss and possibility to quit any time", },
        { val: "FIGHT", doc: "Joining an already started fight somewhere on the map", },
        { val: "SEEK_THE_ENEMY", doc: "Looking for enemy to fight", },
        { val: "GUARD", doc: "Walk around in guard post", },
        { val: "GROUP", doc: "Persuade other creatures to follow - not working", },
        { val: "BARRACK", doc: "Join other creatures into group in barracks", },
        { val: "TEMPLE_PRAY", doc: "Pray in temple", },
        { val: "FREEZE_PRISONERS", doc: "Freeze any enemy creatures starving in prison", },
        { val: "EXPLORE", doc: "Go into unexplored but accessible areas of the map", },
    ],
    [ParamType.IncreaseConfig]: [
        {
            doc: "Percentage of creature size increase for every experience level.",
            val: "SizeIncreaseOnExp"
        },
        {
            doc: "Percentage of creature pay increase for every experience level.",
            val: "PayIncreaseOnExp"
        },
        {
            doc: "Percentage of creature damage increase for every experience level.",
            val: "SpellDamageIncreaseOnExp"
        },
        {
            doc: "Percentage of spell range/area of effect increase for every experience level.",
            val: "RangeIncreaseOnExp"
        },
        {
            doc: "Percentage of creature job value increase for every experience level.",
            val: "JobValueIncreaseOnExp"
        },
        {
            doc: "Percentage of creature health increase for every experience level.",
            val: "HealthIncreaseOnExp"
        },
        {
            doc: "Percentage of creature strength increase for every experience level.",
            val: "StrengthIncreaseOnExp"
        },
        {
            doc: "Percentage of creature dexterity increase for every experience level.",
            val: "DexterityIncreaseOnExp"
        },
        {
            doc: "Percentage of creature defense increase for every experience level.",
            val: "DefenseIncreaseOnExp"
        },
        {
            doc: "Percentage of creature loyalty increase for every experience level.",
            val: "LoyaltyIncreaseOnExp"
        },
        {
            doc: "Percentage ExperienceForHitting increase for every experience level.",
            val: "ExpForHittingIncreaseOnExp"
        },
        {
            doc: "Percentage of creature training cost increase for every experience level. Set to 0 by default.",
            val: "TrainingCostIncreaseOnExp"
        },
        {
            doc: "Percentage of creature scavenging cost increase for every experience level. Set to 0 by default.",
            val: "ScavengingCostIncreaseOnExp"
        },
    ],
    [ParamType.PlayerModifier]: [
        { val: "Health", },
        { val: "Strength", },
        { val: "SpellDamage", },
        { val: "Armour", },
        { val: "Speed", },
        { val: "Salary", },
        { val: "TrainingCost", },
        { val: "ScavengingCost", },
        { val: "Loyalty", },
    ],
    [ParamType.ViewType]: [
        { val: "1", doc: "Keeping mode: normal dungeon view" },
        { val: "2", doc: "First person/possession" },
        { val: "3", doc: "Uncontrolled first person mode (like chicken possession)" },
        { val: "4", doc: "Map view" },
        { val: "5", doc: "Map fade in" },
        { val: "6", doc: "Map fade out" },
    ],
    [ParamType.AvailVars]: [
        { val: "TOTAL_CREATURES", },
        { val: "TOTAL_TRAPS", },
        { val: "TOTAL_DOORS", },
    ],
    [ParamType.RoomRole]: [
        { val: "ROOM_ROLE_NONE", doc: "0 - Can be used to disable others roles if set as first value.", },
        { val: "ROOM_ROLE_KEEPER_STORAGE", doc: "1 - The room is a storage for keeper soul (dungeon heart).", },
        { val: "ROOM_ROLE_LAIR_STORAGE", doc: "2 - The room is a storage for creature lair totems.", },
        { val: "ROOM_ROLE_GOLD_STORAGE", doc: "4 - The room is a storage for gold.", },
        { val: "ROOM_ROLE_FOOD_STORAGE", doc: "8 - The room is a storage for food for creatures.", },
        { val: "ROOM_ROLE_CRATES_STORAGE", doc: "16 - The room is a storage for crates (trap and door boxes).", },
        { val: "ROOM_ROLE_POWERS_STORAGE", doc: "32 - The room is a storage for keeper powers (spellbooks and specials).", },
        { val: "ROOM_ROLE_PRISON", doc: "64 - The room is a prison, forcing friends and foes to stay within.", },
        { val: "ROOM_ROLE_DEAD_STORAGE", doc: "128 - The room is a storage for dead bodies.", },
        { val: "ROOM_ROLE_POOL_SPAWN", doc: "256 - The room is a spawn point for creatures coming into dungeon from creature pool.", },
        { val: "ROOM_ROLE_CONDITIONAL_SPAWN", doc: "512 - The room is a spawn point for creatures with special spawn conditions programmed.", },
        { val: "ROOM_ROLE_SACRIFICE", doc: "1024 - The room can be used to sacrifice creatures and gain rewards.", },
        { val: "ROOM_ROLE_PURIFY_SPELLS", doc: "2048 - The room can be used to cancel negative spells affecting creatures.", },
        { val: "ROOM_ROLE_FOOD_SPAWN", doc: "4096 - The room is a spawn place for food.", },
        { val: "ROOM_ROLE_CRATES_MANUFACTURE", doc: "8192 - The room is a manufacture place for trap crates.", },
        { val: "ROOM_ROLE_RESEARCH", doc: "16384 - The room is a research place for spellbooks and rooms.", },
        { val: "ROOM_ROLE_TORTURE", doc: "32768 - The room is a torture chamber, allowing torture of friends and foes.", },
        { val: "ROOM_ROLE_HAPPY_PRAY", doc: "65536 - The room makes its workers increase their happiness by praying.", },
        { val: "ROOM_ROLE_HEAL_SLEEP", doc: "131072 - The room makes its workers to heal by sleeping.", },
        { val: "ROOM_ROLE_SCAVENGE", doc: "262144 - The room makes its workers scavenge enemy creatures.", },
        { val: "ROOM_ROLE_TRAIN_EXP", doc: "524288 - The room makes its workers increase their experience by training.", },
        { val: "ROOM_ROLE_MAKE_GROUP", doc: "1048576 - The room makes its workers form a group of creatures.", },
        { val: "ROOM_ROLE_GUARD", doc: "2097152 - The room makes its workers guard the room area for enemies.", },
        { val: "ROOM_ROLE_POOL_LEAVE", doc: "4194304 - The room is a gate which allows a creature to leave the players dungeon back to pool.", },
        { val: "ROOM_ROLE_PASS_WATER", doc: "8388608 - The room is a bridge for use over water.", },
        { val: "ROOM_ROLE_PASS_LAVA", doc: "16777216 - The room is a bridge for use over lava.", },
    ],
    [ParamType.ClassicBug]: [
        { val: "RESURRECT_FOREVER", doc: "1 - Dead units can be resurrected multiple times with specials", },
        { val: "OVERFLOW_8BIT", doc: "2 - Creature stats when growing past 255 would go to 0 again", },
        { val: "CLAIM_ROOM_ALL_THINGS", doc: "4 - Claiming a room makes spells/crates on it unusable", },
        { val: "RESURRECT_REMOVED", doc: "8 - Fainted Units can be resurrected(copied) with a special", },
        { val: "NO_HAND_PURGE_ON_DEFEAT", doc: "16 - When you die you can hold on to creatures in your hand", },
        { val: "MUST_OBEY_KEEPS_NOT_DO_JOBS", doc: "32 - Creatures refuse jobs they dislike even with Must Obey enabled", },
        { val: "BREAK_NEUTRAL_WALLS", doc: "64 - In possession you can dig through neutral walls", },
        { val: "ALWAYS_TUNNEL_TO_RED", doc: "128 - Heroes will always target the red keeper", },
        { val: "FULLY_HAPPY_WITH_GOLD", doc: "256 - Any creature will be fully happy with any gold given", },
        { val: "FAINTED_IMMUNE_TO_BOULDER", doc: "512 - Fainted units cannot be killed by boulders", },
        { val: "REBIRTH_KEEPS_SPELLS", doc: "1024 - Vampires keep the spells they learned after resurrection", },
        { val: "STUN_FRIENDLY_UNITS", doc: "2048 - Infighting with imprisonment on will not kill your creatures", },
        { val: "PASSIVE_NEUTRALS", doc: "4096 - Neutral units placed in prison or torture room wander out", },
        { val: "NEUTRAL_TORTURE_CONVERTS", doc: "8192 - Neutral torture rooms convert units into neutral units", },
    ],
    [ParamType.DoorProperty]: [
        { val: "RESIST_NON_MAGIC", doc: "1 - doors are more durable against non magic attacks", },
        { val: "SECRET", doc: "2 - is a secret door", },
        { val: "THICK", doc: "4 - thick doors will take a whole slab", },
        { val: "MIDAS", doc: "8 - drains gold from the owner when it would otherwise take damage", },
    ],
    [ParamType.ObjectProperty]: [
        { val: "EXISTS_ONLY_IN_ROOM", doc: "1", },
        { val: "DESTROYED_ON_ROOM_CLAIM", doc: "2", },
        { val: "CHOWNED_ON_ROOM_CLAIM", doc: "4", },
        { val: "DESTROYED_ON_ROOM_PLACE", doc: "8", },
        { val: "BUOYANT", doc: "16", },
        { val: "BEATING", doc: "32", },
        { val: "HEART", doc: "64", },
    ],
    [ParamType.ObjectGenre]: [
        { val: "DECORATION", },
        { val: "FURNITURE", },
        { val: "VALUABLE", },
        { val: "FOOD", },
        { val: "SPELLBOOK", },
        { val: "POWER", },
        { val: "HEROGATE", },
        { val: "EFFECT", },
        { val: "TREASURE_HOARD", },
        { val: "LAIR_TOTEM", },
        { val: "SPECIALBOX", },
        { val: "WORKSHOPBOX", },
    ],
    [ParamType.PaidOrFree]: [
        { val: "PAID", },
        { val: "FREE", },
    ],
    [ParamType.UpdateFunction]: [
        { val: "UPDATE_DUNGEON_HEART" },
        { val: "UPDATE_CALL_TO_ARMS" },
        { val: "UPDATE_ARMOUR" },
        { val: "UPDATE_OBJECT_SCALE" },
        { val: "UPDATE_POWER_SIGHT" },
        { val: "UPDATE_POWER_LIGHTNING" },
        { val: "NULL" },
    ],
    [ParamType.RoomConfigUsedCapacity]: [
        { val: "count_gold_hoardes_in_room" },
        { val: "count_books_in_room" },
        { val: "count_workers_in_room" },
        { val: "count_crates_in_room" },
        { val: "count_bodies_in_room" },
        { val: "count_food_in_room" },
        { val: "count_lair_occupants" },
        { val: "none" },
    ],
    [ParamType.RoomConfigTotalCapacity]: [
        { val: "slabs_all_only", doc: "One capacity per slab" },
        { val: "slabs_all_wth_effcncy", doc: "Capacity is reduced when the room is less effecient" },
        { val: "slabs_no_min_wth_effcncy", doc: "Capacity is reduced when the room is less effecient, but without a minimum capacity of 1" },
        { val: "slabs_div2_wth_effcncy", doc: "Capacity is reduced by room effeciency, then divided by two" },
        { val: "slabs_div2_nomin_effcncy", doc: "Capacity is reduced by room effeciency, then divided by two, but without a minimum capacity of 1" },
        { val: "slabs_mul2_wth_effcncy", doc: "Capacity is reduced by room effeciency, then multiplied by two" },
        { val: "slabs_pow2_wth_effcncy", doc: "Capacity is reduced by the square of room effeciency, ie 50% efficient means 25% capacity" },
        { val: "gold_slabs_wth_effcncy", doc: "Capacity is reduced by room effeciency, then multiplied by gold hoard types (5)" },
        { val: "gold_slabs_full", doc: "One capacity per slab, then multiplied by gold hoard types" },
        { val: "gold_slabs_div2", doc: "One capacity per slab, then multiplied by gold hoard types, then divided by two" },
        { val: "none", doc: "No capacity" },
    ],
    [ParamType.Orientation]: "North,NorthEast,East,SouthEast,South,SouthWest,West,Northwest".split(",").map(t => ({ val: t })),
    [ParamType.Boolean]: "1,True,Yes,On,Enable,Enabled,0,False,No,Off,Disable,Disabled".split(",").map(t => ({ val: t })),
    [ParamType.All]: [
        { val: "ALL", },
    ],
};

interface CustomEntities {
    traps: DkEntity[];
    doors: DkEntity[];
    crtrs: DkEntity[];
    objects: DkEntity[];
    rooms: DkEntity[];
    spells: DkEntity[];
    creatureSpells: DkEntity[];
}

export class Entities {

    private static origTraps: DkEntity[] = [...DK_ENTITIES[ParamType.Trap]];
    private static origDoors: DkEntity[] = [...DK_ENTITIES[ParamType.Door]];
    private static origCreatures: DkEntity[] = [...DK_ENTITIES[ParamType.Creature]];
    private static origObjects: DkEntity[] = [...DK_ENTITIES[ParamType.Object]];
    private static origRooms: DkEntity[] = [...DK_ENTITIES[ParamType.Room]];
    private static origSpells: DkEntity[] = [...DK_ENTITIES[ParamType.Spell]];
    private static origCreatureSpells: DkEntity[] = [...DK_ENTITIES[ParamType.CreatureSpell]];

    public static findEntity(type: ParamType | undefined, val?: string): DkEntity | undefined {
        return type ?
            DK_ENTITIES[type]?.find(e => Utils.compare(e.val, val))
            : undefined;
    }

    public static findFlagIndex(flag: string): number {
        return DK_ENTITIES[ParamType.Flag].findIndex(e => Utils.compare(e.val, flag));
    }

    public static findTimerIndex(timer: string): number {
        return DK_ENTITIES[ParamType.Timer].findIndex(e => Utils.compare(e.val, timer));
    }

    public static isEntity(word: Word, paramType: ParamType): boolean {
        const upperCased = word.val.toUpperCase();
        return !!(DK_ENTITIES[paramType]?.some(e => e.val.toUpperCase() === upperCased));
    }

    public static suggestForType(type: ParamType, sliceEnd?: number): DkSuggestion[] {
        const cmdMap = DescProvider.getCommandsOfReturnType(type);
        return (DK_ENTITIES[type]?.map(e => MappersDk.entityToDkSuggestion(e, !!e.preselect)) || [])
            .concat([...cmdMap.keys()].map(cmdName => MappersDk.commandToDkSuggestion(cmdName, cmdMap.get(cmdName)!)));
    }

    public static suggestCustomBoxes(): DkSuggestion[] {
        return DK_ENTITIES[ParamType.CustomBox]
            .slice(0, 5)
            .map(e => MappersDk.entityToDkSuggestion(e, !!e.preselect)) || [];
    }

    public static suggestTrapActivated(): DkSuggestion[] {
        return DK_ENTITIES[ParamType.TrapActivated]
            .slice(0, 5)
            .map(e => MappersDk.entityToDkSuggestion(e, !!e.preselect)) || [];
    }

    public static listEntitiesOfType(type: ParamType): DkEntity[] {
        return DK_ENTITIES[type] || [];
    }

    public static setCustomEntities(ce: CustomEntities): void {
        DK_ENTITIES[ParamType.Trap] = Entities.origTraps.concat(ce.traps);
        DK_ENTITIES[ParamType.Door] = Entities.origDoors.concat(ce.doors);
        DK_ENTITIES[ParamType.Creature] = Entities.origCreatures.concat(ce.crtrs);
        DK_ENTITIES[ParamType.Object] = Entities.origObjects.concat(ce.objects);
        DK_ENTITIES[ParamType.Room] = Entities.origRooms.concat(ce.rooms);
        DK_ENTITIES[ParamType.Spell] = Entities.origSpells.concat(ce.spells);
        DK_ENTITIES[ParamType.CreatureSpell] = Entities.origCreatureSpells.concat(ce.creatureSpells);
    }

    public static findPlayersForVars(): DkEntity[] {
        return DK_ENTITIES[ParamType.Keeper].concat(DK_ENTITIES[ParamType.AllPlayers]);
    }

    public static findAllFlags(): DkEntity[] {
        return DK_ENTITIES[ParamType.Flag];
    }

    public static findAllCampaignFlags(): DkEntity[] {
        return DK_ENTITIES[ParamType.CampaignFlag];
    }

    public static findAllTimers(): DkEntity[] {
        return DK_ENTITIES[ParamType.Timer];
    }

    public static insertCompositeTypes() {
        //  check if they were already inserted
        if (DK_ENTITIES[ParamType.ReadVar]) {
            return;
        }
        const readVars: ParamType[] = VAR_COMPOSITES[ParamType.ReadVar];
        const setVars: ParamType[] = VAR_COMPOSITES[ParamType.SetVar];
        const readSetVars: ParamType[] = VAR_COMPOSITES[ParamType.ReadSetVar];;

        DK_ENTITIES[ParamType.ReadVar] = [];
        readVars.forEach(variable => DK_ENTITIES[ParamType.ReadVar].push(...DK_ENTITIES[variable]));

        DK_ENTITIES[ParamType.SetVar] = [];
        setVars.forEach(variable => DK_ENTITIES[ParamType.SetVar].push(...DK_ENTITIES[variable]));

        DK_ENTITIES[ParamType.ReadSetVar] = [];
        readSetVars.forEach(variable => DK_ENTITIES[ParamType.ReadSetVar].push(...DK_ENTITIES[variable]));
    }
}
