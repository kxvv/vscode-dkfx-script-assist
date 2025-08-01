# Change Log

All notable changes to this extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.9.15] - 2025-08-01
### Changed
- SET_GENERATE_SPEED

## [0.9.14] - 2025-07-30
### Added
- SET_NEXT_LEVEL
- SHOW_BONUS_LEVEL
- HIDE_BONUS_LEVEL

## [0.9.13] - 2025-07-24
### Added
- some new properties for set_object_configuration

## [0.9.12] - 2025-07-23
### Added
- UNTAG_MAP_RECT
- 4 new room rules

## [0.9.11] - 2025-07-23
### Added
- TAG_MAP_RECT

## [0.9.10] - 2025-05-01
### Added
- RUN_LUA_CODE

### Changed
- APPROPRIATE_DUNGEON

## [0.9.9] - 2025-04-21
### Changed
- some commands

## [0.9.8] - 2025-04-16
### Added
- DENSE_GOLD

## [0.9.7] - 2025-04-06
### Added
- trap config names

## [0.9.6] - 2025-04-02
### Added
- toggleable flagfields for some commands

## [0.9.5] - 2025-04-01
### Changed
- some compound types to also allow texts

## [0.9.4] - 2025-03-30
### Added
- ICON

## [0.9.3] - 2025-03-23
### Added
- preserve classic bugs change, new creatures

## [0.9.2] - 2025-03-14
### Added
- POWER_TUNNELLER

## [0.9.1] - 2025-02-12
### Added
- TOTAL_SLAPS

## [0.9.0] - 2025-01-31
### Added
- custom entities multiple values

### Fixed
- too many diagnostic hints

## [0.8.19] - 2025-01-26
### Added
- SET_DIGGER

## [0.8.18] - 2025-01-25
### Added
- SPAWN_TYPE

### Changed
- SET_BOX_TOOLTIP root lvl
- command names are always highlighted / even unknown ones

## [0.8.17] - 2025-01-16
### Added
- new creature spells/instances

## [0.8.16] - 2025-01-11
### Added
- LOCK_POSSESSION, BOOLEAN type

## [0.8.15] - 2025-01-05
### Added
- SpellImmunity for creatures, ORIENTATION for add object commands

### Changed
- SET_CREATURE_CONFIGURATION

## [0.8.14] - 2025-01-01
### Fixed
- OFF for COMPUTER_PLAYER command, number for AnimationID

## [0.8.13] - 2024-12-31
### Added
- PLACE_TRAP, LAST_TRAP_EVENT commands

## [0.8.12] - 2024-12-29
### Added
- TRAP#_ACTIVATED

## [0.8.11] - 2024-12-07
### Added
- some missing properties

## [0.8.10] - 2024-12-06
### Added
- more creature and trap properties

## [0.8.9] - 2024-12-02
### Added
- LAST_DEATH_EVENT

## [0.8.8] - 2024-12-01
### Added
- PLACE_DOOR

## [0.8.7] - 2024-11-23
### Added
- new creature properties

## [0.8.6] - 2024-11-17
### Fixed
- secret door slab type

## [0.8.5] - 2024-11-01
### Added
- CREATE_EFFECT_AT_POS height param

### Fixed
- slab not accepting 0s

## [0.8.4] - 2024-10-17
### Added
- object_genre

## [0.8.3] - 2024-10-06
### Changed
- param types of some commands

## [0.8.2] - 2024-09-27
### Changed
- MIDAS door

## [0.8.1] - 2024-09-13
### Changed
- SWAP_CREATURE command

### Fixed
- duplicate PLAYER_GOOD suggestions

## [0.8.0] - 2024-09-12
### Added
- number_compound type hinting
- KEEPERS_DESTROYED

## [0.7.34] - 2024-09-11
### Changed
- docs for some commands

## [0.7.33] - 2024-09-01
### Changed
- SET_COMPUTER_GLOBALS
- computer commands allowed in ifs

## [0.7.32] - 2024-08-27
### Added
- CAST_SPELL_DISEASE creature spell

### Changed
- computer_player command if-able

## [0.7.31] - 2024-08-20
### Added
- ADD_OBJECT_TO_LEVEL_AT_POS command

## [0.7.30] - 2024-08-06
### Fixed
- TOTAL-like variables for IF_AVAILABLE

## [0.7.29] - 2024-08-04
### Fixed
- ADD_EFFECT_GENERATOR_TO_LEVEL params

## [0.7.28] - 2024-07-26
### Added
- ROAMING computer player behavior

## [0.7.27] - 2024-06-27
### Added
- DragUnconsciousToLair
- command suggestions within commands

## [0.7.26] - 2024-06-21
### Changed
- set trap config command added 4th param

## [0.7.25] - 2024-06-15
### Added
- zoom_to_location command
- VIEW_TYPE global

## [0.7.23] - 2024-06-02
### Changed
- SET_CREATURE_CONFIGURATION changes

## [0.7.22] - 2024-05-14
### Changed
- player colors mislabeled
- trap slappable property type change

## [0.7.21] - 2024-05-11
### Changed
- PLAYER_GOOD now can be a player
- trap subtile placement rule

## [0.7.20] - 2024-04-26
### Added
- CHANGE_SLAB_TEXTURE command

### Changed
- game rules update

## [0.7.19] - 2024-04-24
### Added
- some new game rules

## [0.7.18] - 2024-04-16
### Added
- creature spell param for message commands, easter egg game rules

## [0.7.17] - 2024-04-14
### Changed
- location params: CTA and COMBAT

## [0.7.16] - 2024-04-05
### Added
- new hand rules: DROPPED_TIME_LOWER/DROPPED_TIME_HIGHER

## [0.7.15] - 2024-03-29
### Added
- SET_TRAP_CONFIGURATION new fields

## [0.7.14] - 2024-03-28
### Fixed
- new players' variables not working properly

## [0.7.13] - 2024-03-27
### Added
- 3 new players
- reset_action_point command optional param

## [0.7.12] - 2024-03-08
### Added
- DestroyedEffect trap config param

## [0.7.11] - 2024-02-20
### Added
- USE_POWER_ON_PLAYERS_CREATURES command

## [0.7.10] - 2024-02-10
### Added
- custom config: creature spells and spells
- ADD_TO_PLAYER_MODIFIER

## [0.7.9] - 2024-01-25
### Added
- some creature props

### Changed
- randomise_flag params

## [0.7.8] - 2024-01-25
### Added
- some properties for object config

## [0.7.7] - 2024-01-23
### Changed
- made some params optional

## [0.7.6] - 2024-01-21
### Changed
- SET_PLAYER_MODIFIER refactors

## [0.7.5] - 2024-01-19
### Added
- added more game rules
- added SET_PLAYER_MODIFIER command

## [0.7.4] - 2024-01-16
### Added
- added AnimationID to trapconfig

## [0.7.3] - 2024-01-11
### Added
- added SET_INCREASE_ON_EXPERIENCE command
- new powers

## [0.7.2] - 2024-01-09
### Added
- added LEVEL_UP_PLAYERS_CREATURES command

## [0.7.1] - 2024-01-06
### Added
- added MAKE_UNSAFE command

## [0.7.0] - 2023-12-30
### Added
- custom rooms extension setting
- orange, black and purple player colors

### Changed
- max slab and subtile values

## [0.6.21] - 2023-12-23
### Added
- SET_EFFECT_GENERATOR_CONFIGURATION, SET_PLAYER_COLOR

## [0.6.20] - 2023-12-17
### Added
- SET_POWER_CONFIGURATION, ADD_EFFECT_GENERATOR_TO_LEVEL, SET_HAND_GRAPHIC

## [0.6.19] - 2023-11-19
### Added
- secret door

## [0.6.18] - 2023-10-02
### Changed
- rootLvl for some commands, max creature lvl also accepts 0

## [0.6.17] - 2023-09-18
### Added
- NEW_CREATURE_TYPE

## [0.6.16] - 2023-09-11
### Added
- misc stuff

## [0.6.15] - 2023-08-11
### Added
- SET_MUSIC custom tracks support

## [0.6.14] - 2023-08-08
### Changed
- LEVEL_UP_CREATURE, message slots count

## [0.6.13] - 2023-06-28
### Added
- ROOM_PROPERTY entities

### Fixed
- Size_XY

## [0.6.12] - 2023-06-16
### Added
- NEW_OBJECT_TYPE, NEW_ROOM_TYPE command

## [0.6.11] - 2023-06-12
### Added
- NEW_TRAP_TYPE command

## [0.6.10] - 2023-06-10
### Added
- SET_ROOM_CONFIGURATION command

## [0.6.9] - 2023-05-31
### Added
- TNT trap
- PlaceOnBridge trap prop

## [0.6.8] - 2023-05-19
### Added
- druid
- MaxThingsInHand game rule

## [0.6.7] - 2023-05-07
### Added
- jobs for SET_CREATURE_CONFIGURATION

## [0.6.6] - 2023-05-01
### Added
- druid
- USE_SPELL_ON_PLAYERS_CREATURES command

## [0.6.5] - 2023-03-04
### Added
- texture, time_mage

## [0.6.4] - 2023-02-17
### Added
- ADD_OBJECT_TO_LEVEL owner player param

## [0.6.3] - 2023-02-12
### Added
- HIDE_HERO_GATE command
- new creature objectives
- objects and traps properties updated

## [0.6.2] - 2023-01-29
### Added
- minified output bundle
- the extension will hint undocumented flags/action points

## [0.6.1] - 2023-01-26
### Added
- more trap stats
- SET_TEXTURE command

## [0.6.0] - 2023-01-23
### Added
- custom docs

## [0.5.2] - 2023-01-15
### Fixed
- ADD_TO_PARTY command being marked as non-reusable
- location type params not suggesting LAST_EVENT and COMBAT

## [0.5.1] - 2022-12-30
### Added
- BarrackMaxPartySize rule, new maximum party members count
- cosmetic changes

## [0.5.0] - 2022-12-10
### Added
- effects evaluation works for nested commands like DRAWFROM
- support for new lif structure

### Fixed
- a couple of commands params
- creature spell instance not including time bomb spell
- extension not warning user over empty and unused parties

## [0.4.10] - 2022-11-22
### Fixed
- BONUS_LEVEL_TIME, DISPLAY_COUNTDOWN command params
- consecutive types

## [0.4.9] - 2022-11-14
### Added
- IF_ALLIED

### Changed
- ALLY_PLAYERS

## [0.4.8] - 2022-10-21
### Added
- MOVE_CREATURE, COUNT_CREATURES_AT_ACTION_POINT

### Fixed
- DISPLAY_VARIABLE not counting as a flag read

## [0.4.7] - 2022-09-24
### Fixed
- SET_HAND_RULE's affected_by not correctly recognizing spells

## [0.4.6] - 2022-09-17
### Added
- new objects like ferns, mushrooms

### Fixed
- DISPLAY_INFORMATION_WITH_POS incorrect param types

## [0.4.5] - 2022-09-10
### Added
- SET_HAND_RULE
- configurable diagnostics reaction time
- increased maximum action points

### Fixed
- sign changes are no longer case sensitive

## [0.4.4] - 2022-07-29
### Fixed
- suggestions while typing comments
- wrong ErrorCommandOnlyAtRootLvl message text
- display variable target incorrect type

## [0.4.3] - 2022-07-06
### Added
- Effect type

## [0.4.2] - 2022-07-04
### Added
- SWAP_CREATURE command
- custom doors+creatures config

## [0.4.1] - 2022-06-13
### Fixed
- message numbers suggesting zeros, no suggestion for texts

## [0.4.0] - 2022-06-12
### Added
- rewritten interpreter

## [0.3.8] - 2022-05-16
### Added
- flag values now are not limited to 0-255
- USE_SPECIAL_TRANSFER_CREATURE command
- TRANSFER_CREATURE command
- CREATURES_TRANSFERRED global
- some game rules

## [0.3.7] - 2022-05-10
### Fixed
- ADD_HEART_HEALTH, COMPUTE_FLAG command params

## [0.3.6] - 2022-05-06
### Added
- SET_CREATURE_INSTANCE command

## [0.3.5] - 2022-04-24
### Fixed
- duplicate custom entities showing
- slab entities

## [0.3.4] - 2022-04-13
### Added
- objective/info commands' zoom location is now optional

## [0.3.3] - 2022-04-06
### Added
- restarts no longer required after changing settings

### Fixed
- DISPLAY_OBJECTIVE not accepting ALL_PLAYERS

## [0.3.2] - 2022-04-05
### Fixed
- some commands not accepting COMBAT or LAST_EVENT

## [0.3.1] - 2022-04-03
### Added
- custom object setting

### Fixed
- object config typos
- 4 spaces is now default indent

## [0.3.0] - 2022-03-30
### Added
- autoformatter
- autoformatter settings

## [0.2.1] - 2022-03-26
### Fixed
- spell entities
- display variable not accepting some vars

## [0.2.0] - 2022-03-16
### Added
- settings: enabling/disabling diagnostics
- settings: custom trap names

## [0.1.6] - 2022-03-15
### Added
- SET_DOOR command
- some creature properties

## [0.1.5] - 2022-03-07
### Added
- fill params, -1 for reveal_location

## [0.1.4] - 2022-02-24
### Fixed
- providing suggestions while typing comments
- suggesting names of existing parties for NEW_PARTY param type

## [0.1.3] - 2022-02-20
### Added
- more computer events
- more computer checks
- more computer player behaviors

## [0.1.2] - 2022-02-16
### Added
- more trap config properties
- signChanges for SET_TRAP_CONFIGURATION
- ON_NEUTRAL_GROUND criterion

### Fixed
- IF not accepting campaign flags

## [0.1.1] - 2022-02-15
### Added
- CreatureGlobal param type

### Fixed
- commands.yaml '::' typos

## [0.1.0] - 2022-02-15
### Added
- initial commit
