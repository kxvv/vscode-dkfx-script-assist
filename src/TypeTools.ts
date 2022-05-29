import { DK_ENTITIES } from "./Entities";
import { XConst2 } from "./interpreter/model/XConst2";
import { XExp2 } from "./interpreter/model/XExp2";
import { XExpChild } from "./interpreter/model/XExpChild";
import { DkEntity } from "./model/DkEntity";
import { ParamType } from "./model/ParamType";
import { XScriptAnalysis } from "./model/XScriptAnalysis";
import { Utils } from "./Utils";

interface TypeToolCheck {
    line: number;
    word: XConst2;
    analysis: XScriptAnalysis;
}

interface TypeTool {
    check(args: TypeToolCheck): boolean;
}

const CONSTRAINTS = {
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
};

const CHECK_FAIL = Number.NaN;
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
    isEntity(word: XConst2, paramType: ParamType): boolean {
        const upperCased = word.val.toUpperCase();
        return !!(DK_ENTITIES[paramType]?.some(e => e.val === upperCased));
    },
};

const DK_TYPES: { [key: string]: TypeTool } = {
    [ParamType.ActionPoint]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.numberPositive(val) && Utils.isParsedBetween(val, CONSTRAINTS.minAp, CONSTRAINTS.maxAp);
        }
    },
    [ParamType.Byte]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.number(val) && Math.abs(parseInt(val)) <= CONSTRAINTS.maxByte;
        }
    },
    [ParamType.Gold]: {
        check(ttc: TypeToolCheck): boolean {
            return check.number(ttc.word.val);
        }
    },
    [ParamType.HeroGate]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.numberNegative(val) && Utils.isParsedBetween(val, CONSTRAINTS.minHg, CONSTRAINTS.maxHg);
        }
    },
    [ParamType.Location]: {
        check(ttc: TypeToolCheck): boolean {
            return check.isEntity(ttc.word, ParamType.Location)
                || DK_TYPES[ParamType.Keeper].check(ttc)
                || DK_TYPES[ParamType.PlayerGood].check(ttc)
                || DK_TYPES[ParamType.ActionPoint].check(ttc)
                || DK_TYPES[ParamType.HeroGate].check(ttc);
        }
    },
    [ParamType.MsgNumber]: {
        check(ttc: TypeToolCheck): boolean {
            return check.numberPositive(ttc.word.val);
        }
    },
    [ParamType.NewParty]: {
        check(ttc: TypeToolCheck): boolean {
            // TODO
            return true;
        }
    },
    [ParamType.NonNegNumber]: {
        check(ttc: TypeToolCheck): boolean {
            return check.numberPositiveOrZero(ttc.word.val);
        }
    },
    [ParamType.Number]: {
        check(ttc: TypeToolCheck): boolean {
            return check.number(ttc.word.val);
        }
    },
    [ParamType.Party]: {
        check(ttc: TypeToolCheck): boolean {
            // TODO
            return true;
        }
    },
    [ParamType.ReadVar]: {
        check(ttc: TypeToolCheck): boolean {
            const from: ParamType[] = [
                ParamType.CampaignFlag, ParamType.Creature, ParamType.CustomBox,
                ParamType.Door, ParamType.Flag, ParamType.Global,
                ParamType.Room, ParamType.Timer, ParamType.Trap,
            ];
            return from.some(t => check.isEntity(ttc.word, t));
        }
    },
    [ParamType.SetVar]: {
        check(ttc: TypeToolCheck): boolean {
            const from: ParamType[] = [
                ParamType.Flag, ParamType.CampaignFlag, ParamType.CustomBox
            ];
            return from.some(t => check.isEntity(ttc.word, t));
        }
    },
    [ParamType.Subtile]: {
        check(ttc: TypeToolCheck): boolean {
            const val = ttc.word.val;
            return check.numberPositiveOrZero(val) && Utils.isParsedBetween(val, CONSTRAINTS.minSubtile, CONSTRAINTS.maxSubtile);
        }
    },
    [ParamType.Text]: {
        check(ttc: TypeToolCheck): boolean {
            return /^".*"$/i.test(ttc.word.val) && (ttc.word.val.length - 2) <= CONSTRAINTS.maxTextLen;
        }
    },
    [ParamType.Time]: {
        check(ttc: TypeToolCheck): boolean {
            return check.numberPositiveOrZero(ttc.word.val);
        }
    },
    [ParamType.Unknown]: {
        check(ttc: TypeToolCheck): boolean {
            return true;
        }
    },
};

export class TypeTools {
    public static utilFor(type: ParamType): TypeTool {
        let customUtil: TypeTool = DK_TYPES[type];
        if (!customUtil) {
            customUtil = {
                check(ttc: TypeToolCheck): boolean {
                    return check.isEntity(ttc.word, type);
                }
            };
        }
        return customUtil;
    }
}