export enum ParamType {
    ActionPoint = "ACTION_POINT",
    AllPlayers = "ALL_PLAYERS",
    AnyCreature = "ANY_CREATURE",
    AudioType = "AUDIO_TYPE",
    Auto = "AUTO",
    Binary = "BINARY",
    Button = "BUTTON",
    Byte = "BYTE",
    CampaignFlag = "CAMPAIGN_FLAG",
    CompCheck = "COMP_CHECK",
    CompEvent = "COMP_EVENT",
    CompGlobal = "COMP_GLOBAL",
    CompProcess = "COMP_PROCESS",
    CompareOperator = "COMPARE_OPERATOR",
    Computer = "COMPUTER",
    Creature = "CREATURE",
    CreatureConfig = "CREATURE_CONFIG",
    CreatureGlobal = "CREATURE_GLOBAL",
    CreatureProperty = "CREATURE_PROPERTY",
    CreatureSpell = "CREATURE_SPELL",
    CreatureTendency = "CREATURE_TENDENCY",
    Criterion = "CRITERION",
    CustomBox = "CUSTOM_BOX",
    DisplayVarTargetType = "DISPLAY_VAR_TARGET_TYPE",
    Door = "DOOR",
    DoorConfig = "DOOR_CONFIG",
    Effect = "EFFECT",
    FillType = "FILL_TYPE",
    Flag = "FLAG",
    GameRule = "GAME_RULE",
    Global = "GLOBAL",
    Gold = "GOLD",
    HeadFor = "HEAD_FOR",
    HeroGate = "HERO_GATE",
    Keeper = "KEEPER",
    KeeperIndex = "KEEPER_INDEX",
    Location = "LOCATION",
    LockState = "LOCK_STATE",
    Lvl = "LVL",
    MsgNumber = "MSG_NUMBER",
    NewParty = "NEW_PARTY",
    NonNegNumber = "NUMBER+",
    Number = "NUMBER",
    Object = "OBJECT",
    ObjectConfig = "OBJECT_CONFIG",
    Objective = "OBJECTIVE",
    OneToTen = "1-10",
    Operation = "OPERATION",
    Party = "PARTY",
    Player = "PLAYER",
    PlayerGood = "PLAYER_GOOD",
    Power = "POWER",
    PowerLvl = "POWER_LVL",
    Range = "RANGE",
    ReadVar = "READABLE_VAR",
    ReadSetVar = "READSET_VAR",
    ResearchType = "RESEARCH_TYPE",
    Room = "ROOM",
    RoomAvailability = "ROOM_AVAILABILITY",
    Rule = "RULE",
    SacrificeCmd = "SACRIFICE_CMD",
    SetVar = "SETTABLE_VAR",
    Slab = "SLAB",
    SlabType = "SLAB_TYPE",
    Spell = "SPELL",
    Subtile = "SUBTILE",
    Text = "TEXT",
    Time = "TIME",
    Timer = "TIMER",
    Trap = "TRAP",
    TrapActivationType = "TRAP_ACTIVATION_TYPE",
    TrapConfig = "TRAP_CONFIG",
    TrapTriggerType = "TRAP_TRIGGER_TYPE",
    Unknown = "UNKNOWN",
    Void = "VOID",
    Version = "VERSION",
    Zero = "ZERO"
}

export const FINAL_PARAM_TYPES: Readonly<ParamType[]> = [
    ParamType.AudioType, ParamType.Button, ParamType.CompareOperator,
    ParamType.CreatureConfig, ParamType.CreatureGlobal, ParamType.CreatureProperty,
    ParamType.CreatureTendency, ParamType.DisplayVarTargetType,
    ParamType.DoorConfig, ParamType.FillType, ParamType.GameRule, ParamType.Global,
    ParamType.HeadFor, ParamType.MsgNumber, ParamType.NewParty, ParamType.Operation,
    ParamType.ObjectConfig, ParamType.Range, ParamType.ResearchType, ParamType.Rule,
    ParamType.SacrificeCmd, ParamType.Text, ParamType.TrapActivationType, ParamType.TrapConfig,
    ParamType.TrapTriggerType, ParamType.Version, ParamType.Void
];
