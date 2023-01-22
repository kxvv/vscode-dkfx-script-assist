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

export interface TypeTool {
    check(args: TypeToolCheck): boolean | DKError;
    suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[];
}

export const CONSTRAINTS: Readonly<{ [key: string]: number }> = {
    minMsgNumber: 0,
    maxMsgNumber: 50,
    maxByte: 255,
    minAp: 0, // action point
    maxAp: 255,
    minHg: -255, // hero gate
    maxHg: -1,
    minSlab: 0,
    maxSlab: 85,
    minSubtile: 0,
    maxSubtile: 255,
    maxTextLen: 1024,
    maxPartyMembers: 30,
};

export const VAR_COMPOSITES = {
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

const DK_TYPES: { [key: string]: TypeTool } = {
    [ParamType.ActionPoint]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.numberPositive(val) && Utils.isParsedBetween(val, CONSTRAINTS.minAp, CONSTRAINTS.maxAp);
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return analysis.suggestLocationsFromCustomDoc(ParamType.ActionPoint);
        }
    },
    [ParamType.Byte]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.number(val) && Math.abs(parseInt(val)) <= CONSTRAINTS.maxByte;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.CampaignFlag]: {
        check(ttc: TypeToolCheck): boolean {
            return check.isEntity(ttc.word, ParamType.CampaignFlag);
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return analysis.suggestFromCustomDoc(ParamType.CampaignFlag, Entities.suggestForType(ParamType.CampaignFlag), leafExp, index);
        }
    },
    [ParamType.CustomBox]: {
        check(ttc: TypeToolCheck): boolean {
            return check.isEntity(ttc.word, ParamType.CustomBox);
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return Entities.suggestCustomBoxes();
        }
    },
    [ParamType.Flag]: {
        check(ttc: TypeToolCheck): boolean {
            return check.isEntity(ttc.word, ParamType.Flag);
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return analysis.suggestFromCustomDoc(ParamType.Flag, Entities.suggestForType(ParamType.Flag), leafExp, index);
        }
    },
    [ParamType.Gold]: {
        check(ttc: TypeToolCheck): boolean {
            return check.number(ttc.word.val);
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.HeroGate]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.numberNegative(val) && Utils.isParsedBetween(val, CONSTRAINTS.minHg, CONSTRAINTS.maxHg);
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return analysis.suggestLocationsFromCustomDoc(ParamType.HeroGate);
        }
    },
    [ParamType.Location]: {
        check(ttc: TypeToolCheck): boolean | DKError {
            return check.isEntity(ttc.word, ParamType.Location)
                || TypeTools.toolFor(ParamType.Keeper).check(ttc)
                || TypeTools.toolFor(ParamType.PlayerGood).check(ttc)
                || TypeTools.toolFor(ParamType.ActionPoint).check(ttc)
                || TypeTools.toolFor(ParamType.HeroGate).check(ttc);
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return TypeTools.toolFor(ParamType.Keeper).suggest(analysis)
                .concat(TypeTools.toolFor(ParamType.ActionPoint).suggest(analysis))
                .concat(TypeTools.toolFor(ParamType.HeroGate).suggest(analysis))
                .concat(TypeTools.toolFor(ParamType.PlayerGood).suggest(analysis))
                .concat(Entities.suggestForType(ParamType.Location));
        }
    },
    [ParamType.MsgNumber]: {
        check(ttc: TypeToolCheck): boolean | DKError {
            return Utils.isParsedBetween(ttc.word.val, CONSTRAINTS.minMsgNumber, CONSTRAINTS.maxMsgNumber)
                || new ErrorMsgOutOfRange(ttc.word, CONSTRAINTS.minMsgNumber, CONSTRAINTS.maxMsgNumber);
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
        check(ttc: TypeToolCheck): boolean | DKError {
            if (ttc.analysis?.isPartyDeclared(ttc.word.val)) {
                return new ErrorPartyNameNotUnique(ttc.word.val, ttc.word);
            }
            return true;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.NonNegNumber]: {
        check(ttc: TypeToolCheck): boolean {
            return check.numberPositiveOrZero(ttc.word.val);
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Number]: {
        check(ttc: TypeToolCheck): boolean {
            return check.number(ttc.word.val);
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Party]: {
        check(ttc: TypeToolCheck): boolean | DKError {
            if (!ttc.analysis?.isPartyDeclared(ttc.word.val)) {
                return new ErrorPartyUnknown(ttc.word.val, ttc.word);
            }
            return true;
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
        check(ttc: TypeToolCheck): boolean {
            return VAR_COMPOSITES[ParamType.ReadVar].some(t => check.isEntity(ttc.word, t));
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return VAR_COMPOSITES[ParamType.ReadVar].map(t => TypeTools.toolFor(t).suggest(analysis, leafExp, index)).flat();
        }
    },
    [ParamType.ReadSetVar]: {
        check(ttc: TypeToolCheck): boolean {
            return VAR_COMPOSITES[ParamType.ReadSetVar].some(t => check.isEntity(ttc.word, t));
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return VAR_COMPOSITES[ParamType.ReadSetVar].map(t => TypeTools.toolFor(t).suggest(analysis, leafExp, index)).flat();
        }
    },
    [ParamType.SetVar]: {
        check(ttc: TypeToolCheck): boolean {
            return VAR_COMPOSITES[ParamType.SetVar].some(t => check.isEntity(ttc.word, t));
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return VAR_COMPOSITES[ParamType.SetVar].map(t => TypeTools.toolFor(t).suggest(analysis, leafExp, index)).flat();
        }
    },
    [ParamType.Slab]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.numberPositive(val) && Utils.isParsedBetween(val, CONSTRAINTS.minSlab, CONSTRAINTS.maxSlab);
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Subtile]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.numberPositiveOrZero(val) && Utils.isParsedBetween(val, CONSTRAINTS.minSubtile, CONSTRAINTS.maxSubtile);
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Text]: {
        check(ttc: TypeToolCheck): boolean {
            return /^".*"$/i.test(ttc.word.val) && (ttc.word.val.length - 2) <= CONSTRAINTS.maxTextLen;
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
        check(ttc: TypeToolCheck): boolean {
            return check.numberPositiveOrZero(ttc.word.val);
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Timer]: {
        check(ttc: TypeToolCheck): boolean {
            return check.isEntity(ttc.word, ParamType.Timer);
        },
        suggest(analysis: ScriptAnalysis, leafExp?: Exp | null, index?: number): DkSuggestion[] {
            return analysis.suggestFromCustomDoc(ParamType.Timer, Entities.suggestForType(ParamType.Timer), leafExp, index);
        }
    },
    [ParamType.Unknown]: {
        check(ttc: TypeToolCheck): boolean {
            return true;
        },
        suggest(analysis: ScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Void]: {
        check(ttc: TypeToolCheck): boolean {
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
            check(ttc: TypeToolCheck): boolean {
                return check.isEntity(ttc.word, type);
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
            case "WHITE":
                return "PLAYER_GOOD";
        }
        return value;
    }

    public static playerAbbrevToPlayerName(abbrev: string): string {
        if (abbrev.length === 2) {
            return {
                "P0": "PLAYER0",
                "P1": "PLAYER1",
                "P2": "PLAYER2",
                "P3": "PLAYER3",
                "PG": "PLAYER_GOOD",
                "PA": "ALL_PLAYERS",
            }[abbrev.toUpperCase()] || abbrev;
        }
        return abbrev;
    }
}
