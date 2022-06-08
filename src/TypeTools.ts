import { DK_ENTITIES } from "./Entities";
import { ErrorMsgOutOfRange, ErrorPartyNameNotUnique, ErrorPartyUnknown, XError } from "./interpreter/model/XError";
import { XWord } from "./interpreter/model/XWord";
import { MappersDk } from "./MappersDk";
import { DkSuggestion } from "./model/DkSuggestion";
import { ParamType } from "./model/ParamType";
import { XScriptAnalysis } from "./model/XScriptAnalysis";
import { Utils } from "./Utils";

interface TypeToolCheck {
    word: XWord;
    line?: number;
    analysis?: XScriptAnalysis;
}

export interface TypeTool {
    check(args: TypeToolCheck): boolean | XError;
    suggest(analysis: XScriptAnalysis): DkSuggestion[];
}

export const CONSTRAINTS = {
    minMsgNumber: 0,
    maxMsgNumber: 50,
    maxByte: 255,
    minAp: 0, // action point
    maxAp: 48,
    minHg: -48, // hero gate
    maxHg: -1,
    minSlab: 0,
    maxSlab: 85,
    minSubtile: 0,
    maxSubtile: 255,
    maxTextLen: 1024,
    maxPartyMembers: 7,
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
    isEntity(word: XWord, paramType: ParamType): boolean {
        const upperCased = word.val.toUpperCase();
        return !!(DK_ENTITIES[paramType]?.some(e => e.val === upperCased));
    },
};

const readVars: ParamType[] = [
    ParamType.CampaignFlag, ParamType.Creature, ParamType.CustomBox,
    ParamType.Door, ParamType.Flag, ParamType.Global,
    ParamType.Room, ParamType.Timer, ParamType.Trap,
];
const setVars: ParamType[] = [
    ParamType.Flag, ParamType.CampaignFlag, ParamType.CustomBox
];
const readSetVars: ParamType[] = [...new Set(readVars.concat(setVars))];

const DK_TYPES: { [key: string]: TypeTool } = {
    [ParamType.ActionPoint]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.numberPositive(val) && Utils.isParsedBetween(val, CONSTRAINTS.minAp, CONSTRAINTS.maxAp);
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Byte]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.number(val) && Math.abs(parseInt(val)) <= CONSTRAINTS.maxByte;
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.CustomBox]: {
        check(ttc: TypeToolCheck): boolean {
            return check.isEntity(ttc.word, ParamType.CustomBox);
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return DK_ENTITIES[ParamType.CustomBox].slice(0, 5).map(e => MappersDk.entityToDkSuggestion(e));
        }
    },
    [ParamType.Gold]: {
        check(ttc: TypeToolCheck): boolean {
            return check.number(ttc.word.val);
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.HeroGate]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.numberNegative(val) && Utils.isParsedBetween(val, CONSTRAINTS.minHg, CONSTRAINTS.maxHg);
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Location]: {
        check(ttc: TypeToolCheck): boolean | XError {
            return check.isEntity(ttc.word, ParamType.Location)
                || TypeTools.utilFor(ParamType.Keeper).check(ttc)
                || TypeTools.utilFor(ParamType.PlayerGood).check(ttc)
                || TypeTools.utilFor(ParamType.ActionPoint).check(ttc)
                || TypeTools.utilFor(ParamType.HeroGate).check(ttc);
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return TypeTools.utilFor(ParamType.Keeper).suggest(analysis)
                .concat(TypeTools.utilFor(ParamType.PlayerGood).suggest(analysis));
        }
    },
    [ParamType.MsgNumber]: {
        check(ttc: TypeToolCheck): boolean | XError {
            return Utils.isParsedBetween(ttc.word.val, CONSTRAINTS.minMsgNumber, CONSTRAINTS.maxMsgNumber)
                || new ErrorMsgOutOfRange(ttc.word, CONSTRAINTS.minMsgNumber, CONSTRAINTS.maxMsgNumber);
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            const msgNum = analysis.getNextFreeMsgNumber();
            if (msgNum != null) {
                return [MappersDk.entityToDkSuggestion({ val: String(msgNum) })];
            }
            return [];
        }
    },
    [ParamType.NewParty]: {
        check(ttc: TypeToolCheck): boolean | XError {
            if (ttc.analysis?.isPartyDeclared(ttc.word.val)) {
                return new ErrorPartyNameNotUnique(ttc.word.val, ttc.word);
            }
            return true;
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.NonNegNumber]: {
        check(ttc: TypeToolCheck): boolean {
            return check.numberPositiveOrZero(ttc.word.val);
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Number]: {
        check(ttc: TypeToolCheck): boolean {
            return check.number(ttc.word.val);
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Party]: {
        check(ttc: TypeToolCheck): boolean | XError {
            if (!ttc.analysis?.isPartyDeclared(ttc.word.val)) {
                return new ErrorPartyUnknown(ttc.word.val, ttc.word);
            }
            return true;
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return analysis.getDeclaredPartyNames().map(name => MappersDk.entityToDkSuggestion(
                { val: name }
            ));
        }
    },
    [ParamType.ReadVar]: {
        check(ttc: TypeToolCheck): boolean {
            return readVars.some(t => check.isEntity(ttc.word, t));
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return readVars.map(t => TypeTools.utilFor(t).suggest(analysis)).flat();
        }
    },
    [ParamType.ReadSetVar]: {
        check(ttc: TypeToolCheck): boolean {
            return readSetVars.some(t => check.isEntity(ttc.word, t));
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return readSetVars.map(t => TypeTools.utilFor(t).suggest(analysis)).flat();
        }
    },
    [ParamType.SetVar]: {
        check(ttc: TypeToolCheck): boolean {
            return setVars.some(t => check.isEntity(ttc.word, t));
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return setVars.map(t => TypeTools.utilFor(t).suggest(analysis)).flat();
        }
    },
    [ParamType.Slab]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.numberPositive(val) && Utils.isParsedBetween(val, CONSTRAINTS.minSlab, CONSTRAINTS.maxSlab);
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Subtile]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.numberPositiveOrZero(val) && Utils.isParsedBetween(val, CONSTRAINTS.minSubtile, CONSTRAINTS.maxSubtile);
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Text]: {
        check(ttc: TypeToolCheck): boolean {
            return /^".*"$/i.test(ttc.word.val) && (ttc.word.val.length - 2) <= CONSTRAINTS.maxTextLen;
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Time]: {
        check(ttc: TypeToolCheck): boolean {
            return check.numberPositiveOrZero(ttc.word.val);
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Unknown]: {
        check(ttc: TypeToolCheck): boolean {
            return true;
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
    [ParamType.Void]: {
        check(ttc: TypeToolCheck): boolean {
            return false;
        },
        suggest(analysis: XScriptAnalysis): DkSuggestion[] {
            return [];
        }
    },
};

export class TypeTools {

    public static utilFor(type: ParamType): TypeTool {
        return DK_TYPES[type] || {
            check(ttc: TypeToolCheck): boolean {
                return check.isEntity(ttc.word, type);
            },
            suggest(analysis: XScriptAnalysis): DkSuggestion[] {
                return DK_ENTITIES[type]?.map(e => MappersDk.entityToDkSuggestion(e)) || [];
            }
        };
    }
}
