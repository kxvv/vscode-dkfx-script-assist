import { Entities } from "./Entities";
import { MappersDk } from "./MappersDk";
import { DKError, ErrorMsgOutOfRange, ErrorPartyNameNotUnique, ErrorPartyUnknown } from "./model/DKError";
import { DkSuggestion } from "./model/DkSuggestion";
import { Exp } from "./model/Exp";
import { ParamType } from "./model/ParamType";
import { ScriptAnalysis } from "./model/ScriptAnalysis";
import { SuggestionKind } from "./model/SuggestionKind";
import { Word } from "./model/Word";
import { Utils } from "./Utils";

interface TypeToolCheck {
    word: Word;
    line?: number;
    analysis?: ScriptAnalysis;
}

export type TypeCheckResult = ParamType | false | DKError;

export interface TypeTool {
    check(args: TypeToolCheck): TypeCheckResult;
    suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[];
}

export const CONSTRAINTS: Readonly<Record<string, number>> = {
    minMsgNumber: 0,
    maxMsgNumber: 256,
    maxByte: 255,
    minAp: 0, // action point
    maxAp: 255,
    minHg: -255, // hero gate
    maxHg: -1,
    minSlab: 0,
    maxSlab: 170,
    minSubtile: 0,
    maxSubtile: 510,
    maxTextLen: 1024,
    maxPartyMembers: 30,
};

export const VAR_COMPOSITES: Record<ParamType | string, ParamType[]> = {
    [ParamType.ReadVar]: [
        ParamType.CampaignFlag, ParamType.Creature, ParamType.CustomBox,
        ParamType.Door, ParamType.Flag, ParamType.Global,
        ParamType.Room, ParamType.Timer, ParamType.Trap,
    ],
    [ParamType.SetVar]: [
        ParamType.Flag, ParamType.CampaignFlag, ParamType.CustomBox
    ],
    [ParamType.ReadSetVar]: [
        ParamType.CampaignFlag, ParamType.Creature, ParamType.CustomBox,
        ParamType.Door, ParamType.Flag, ParamType.Global,
        ParamType.Room, ParamType.Timer, ParamType.Trap,
    ],
    [ParamType.Location]: [
        ParamType.Keeper,
        ParamType.ActionPoint,
        ParamType.HeroGate,
    ]
};

const check = {
    number(val: string): boolean {
        return /^-?\d+$/.test(val);
    },
    numberPositive(val: string): boolean {
        return /^[1-9]\d*$/.test(val);
    },
    numberPositiveOrZero(val: string): boolean {
        return /^\d+$/.test(val);
    },
    numberNegative(val: string): boolean {
        return /^-[1-9]\d*$/.test(val);
    },
    numberNegativeOrZero(val: string): boolean {
        return /^-\d+$/.test(val);
    },
    isEntity(word: Word, paramType: ParamType): boolean {
        return Entities.isEntity(word, paramType);
    },
};

const DK_TYPES: Record<ParamType | string, TypeTool> = {
    [ParamType.ActionPoint]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            const val = ttc.word.val;
            return check.numberPositive(val) && Utils.isParsedBetween(val, CONSTRAINTS.minAp, CONSTRAINTS.maxAp)
                ? ParamType.ActionPoint : false;
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return analysis.suggestLocationsFromCustomDoc(ParamType.ActionPoint);
        }
    },
    [ParamType.Byte]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            const val = ttc.word.val;
            return check.number(val) && Math.abs(parseInt(val)) <= CONSTRAINTS.maxByte
                ? ParamType.Byte : false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.CampaignFlag]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return check.isEntity(ttc.word, ParamType.CampaignFlag)
                ? ParamType.CampaignFlag : false;
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return analysis.suggestFromCustomDoc(ParamType.CampaignFlag, Entities.suggestForType(ParamType.CampaignFlag), leafExp, index);
        }
    },
    [ParamType.Creature]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            if (ttc.analysis?.getTempCreatureNames().some(tempCr => tempCr.toLowerCase() === ttc.word.val.toLowerCase())) {
                return ParamType.Creature;
            }
            return check.isEntity(ttc.word, ParamType.Creature) ? ParamType.Creature : false;
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            const tempSuggestions = analysis.getTempCreatureNames().map(tt => MappersDk.textToDkSuggestion(tt));
            return tempSuggestions.concat(
                Entities.suggestForType(ParamType.Creature)
            );
        }
    },
    [ParamType.CustomBox]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return check.isEntity(ttc.word, ParamType.CustomBox) ? ParamType.CustomBox : false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return Entities.suggestCustomBoxes();
        }
    },
    [ParamType.Flag]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return check.isEntity(ttc.word, ParamType.Flag) ? ParamType.Flag : false;
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return analysis.suggestFromCustomDoc(ParamType.Flag, Entities.suggestForType(ParamType.Flag), leafExp, index);
        }
    },
    [ParamType.Gold]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return check.number(ttc.word.val) ? ParamType.Gold : false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.HeroGate]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            const val = ttc.word.val;
            return check.numberNegative(val) && Utils.isParsedBetween(val, CONSTRAINTS.minHg, CONSTRAINTS.maxHg)
                ? ParamType.HeroGate : false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return analysis.suggestLocationsFromCustomDoc(ParamType.HeroGate);
        }
    },
    [ParamType.Location]: {
        check(ttc: TypeToolCheck): TypeCheckResult | DKError {
            if (check.isEntity(ttc.word, ParamType.Location)) {
                return ParamType.Location;
            }
            return VAR_COMPOSITES[ParamType.Location].find(t => TypeTools.toolFor(t).check(ttc)) || false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return TypeTools.toolFor(ParamType.Keeper).suggest(analysis)
                .concat(TypeTools.toolFor(ParamType.ActionPoint).suggest(analysis))
                .concat(TypeTools.toolFor(ParamType.HeroGate).suggest(analysis))
                .concat(Entities.suggestForType(ParamType.Location));
        }
    },
    [ParamType.MsgNumber]: {
        check(ttc: TypeToolCheck): TypeCheckResult | DKError {
            return Utils.isParsedBetween(ttc.word.val, CONSTRAINTS.minMsgNumber, CONSTRAINTS.maxMsgNumber)
                ? ParamType.MsgNumber : new ErrorMsgOutOfRange(ttc.word, CONSTRAINTS.minMsgNumber, CONSTRAINTS.maxMsgNumber);
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            const msgNum = analysis.getNextFreeMsgNumber();
            if (msgNum != null) {
                return [
                    MappersDk.entityToDkSuggestion(
                        { val: String(msgNum) },
                        undefined,
                        SuggestionKind.Constant,
                    )
                ];
            }
            return [];
        }
    },
    [ParamType.NewParty]: {
        check(ttc: TypeToolCheck): TypeCheckResult | DKError {
            if (ttc.analysis?.isPartyDeclared(ttc.word.val)) {
                return new ErrorPartyNameNotUnique(ttc.word.val, ttc.word);
            }
            return ParamType.NewParty;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.NonNegNumber]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return check.numberPositiveOrZero(ttc.word.val) ? ParamType.NonNegNumber : false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Number]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return check.number(ttc.word.val) ? ParamType.Number : false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.NumberCompound]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return check.numberPositiveOrZero(ttc.word.val) ? ParamType.NumberCompound : false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Object]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            if (ttc.analysis?.getTempObjectNames().some(tempObj => tempObj.toLowerCase() === ttc.word.val.toLowerCase())) {
                return ParamType.Object;
            }
            return check.isEntity(ttc.word, ParamType.Object) ? ParamType.Object : false;
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            const tempSuggestions = analysis.getTempObjectNames().map(tt => MappersDk.textToDkSuggestion(tt));
            return tempSuggestions.concat(
                Entities.suggestForType(ParamType.Object)
            );
        }
    },
    [ParamType.Party]: {
        check(ttc: TypeToolCheck): TypeCheckResult | DKError {
            if (!ttc.analysis?.isPartyDeclared(ttc.word.val)) {
                return new ErrorPartyUnknown(ttc.word.val, ttc.word);
            }
            return ParamType.Party;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return analysis.getDeclaredPartyNames().map(name => MappersDk.entityToDkSuggestion(
                { val: name },
                undefined,
                SuggestionKind.Variable,
            ));
        }
    },
    [ParamType.ReadVar]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return VAR_COMPOSITES[ParamType.ReadVar].find(t => TypeTools.toolFor(t).check(ttc)) || false;
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return VAR_COMPOSITES[ParamType.ReadVar].map(t => TypeTools.toolFor(t).suggest(analysis, leafExp, index)).flat();
        }
    },
    [ParamType.ReadSetVar]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return VAR_COMPOSITES[ParamType.ReadSetVar].find(t => TypeTools.toolFor(t).check(ttc)) || false;
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return VAR_COMPOSITES[ParamType.ReadSetVar].map(t => TypeTools.toolFor(t).suggest(analysis, leafExp, index)).flat();
        }
    },
    [ParamType.Room]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            if (ttc.analysis?.getTempRoomNames().some(tempRoom => tempRoom.toLowerCase() === ttc.word.val.toLowerCase())) {
                return ParamType.Room;
            }
            return check.isEntity(ttc.word, ParamType.Room) ? ParamType.Room : false;
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            const tempSuggestions = analysis.getTempRoomNames().map(tt => MappersDk.textToDkSuggestion(tt));
            return tempSuggestions.concat(
                Entities.suggestForType(ParamType.Room)
            );
        }
    },
    [ParamType.RoomAll]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            if (ttc.analysis?.getTempRoomNames().some(tempRoom => tempRoom.toLowerCase() === ttc.word.val.toLowerCase())) {
                return ParamType.RoomAll;
            }
            return check.isEntity(ttc.word, ParamType.RoomAll) ? ParamType.RoomAll : false;
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            const tempSuggestions = analysis.getTempRoomNames().map(tt => MappersDk.textToDkSuggestion(tt));
            return tempSuggestions.concat(
                Entities.suggestForType(ParamType.RoomAll)
            );
        }
    },
    [ParamType.SetVar]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return VAR_COMPOSITES[ParamType.SetVar].find(t => TypeTools.toolFor(t).check(ttc)) || false;
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return VAR_COMPOSITES[ParamType.SetVar].map(t => TypeTools.toolFor(t).suggest(analysis, leafExp, index)).flat();
        }
    },
    [ParamType.Slab]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            const val = ttc.word.val;
            return check.numberPositiveOrZero(val) && Utils.isParsedBetween(val, CONSTRAINTS.minSlab, CONSTRAINTS.maxSlab)
                ? ParamType.Slab : false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Subtile]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            const val = ttc.word.val;
            return check.numberPositiveOrZero(val) && Utils.isParsedBetween(val, CONSTRAINTS.minSubtile, CONSTRAINTS.maxSubtile)
                ? ParamType.Subtile : false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Text]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return /^".*"$/i.test(ttc.word.val) && (ttc.word.val.length - 2) <= CONSTRAINTS.maxTextLen
                ? ParamType.Text : false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [
                MappersDk.entityToDkSuggestion(
                    { val: `""` },
                    undefined,
                    SuggestionKind.Text,
                )
            ];
        }
    },
    [ParamType.Time]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return check.numberPositiveOrZero(ttc.word.val) ? ParamType.Time : false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Timer]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return check.isEntity(ttc.word, ParamType.Timer) ? ParamType.Timer : false;
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return analysis.suggestFromCustomDoc(ParamType.Timer, Entities.suggestForType(ParamType.Timer), leafExp, index);
        }
    },
    [ParamType.Trap]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            if (ttc.analysis?.getTempTrapNames().some(tempTrap => tempTrap.toLowerCase() === ttc.word.val.toLowerCase())) {
                return ParamType.Trap;
            }
            return check.isEntity(ttc.word, ParamType.Trap) ? ParamType.Trap : false;
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            const tempSuggestions = analysis.getTempTrapNames().map(tt => MappersDk.textToDkSuggestion(tt));
            return tempSuggestions.concat(
                Entities.suggestForType(ParamType.Trap)
            );
        }
    },
    [ParamType.Unknown]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return ParamType.Unknown;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Void]: {
        check(ttc: TypeToolCheck): TypeCheckResult {
            return false;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
};

export class TypeTools {

    public static toolFor(type: ParamType): TypeTool {
        return DK_TYPES[type] || {
            check(ttc: TypeToolCheck): TypeCheckResult {
                return check.isEntity(ttc.word, type) ? type : false;
            },
            suggest(analysis: ScriptAnalysis): DkSuggestion[] {
                return Entities.suggestForType(type);
            }
        };
    }

    public static isTypeCustomDocumentable(type?: ParamType): boolean {
        return type ? [
            ParamType.Flag,
            ParamType.CampaignFlag,
            ParamType.ActionPoint,
            ParamType.HeroGate,
            ParamType.Timer,
            ParamType.ReadVar,
            ParamType.SetVar,
            ParamType.ReadSetVar,
            ParamType.Location,
        ].includes(type) : false;
    }

    public static playerColorToIndexedPlayer(value: string): string {
        if (value[0] === "P" || value[0] === "p") { return value; }
        value = value.toUpperCase();
        switch (value) {
            case "RED":
                return "PLAYER0";
            case "BLUE":
                return "PLAYER1";
            case "GREEN":
                return "PLAYER2";
            case "YELLOW":
                return "PLAYER3";
            case "PURPLE":
                return "PLAYER4";
            case "BLACK":
                return "PLAYER5";
            case "ORANGE":
                return "PLAYER6";
            case "WHITE":
                return "PLAYER_GOOD";
        }
        return value;
    }
}
