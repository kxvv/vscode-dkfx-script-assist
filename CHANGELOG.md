# Change Log

All notable changes to this extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

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
