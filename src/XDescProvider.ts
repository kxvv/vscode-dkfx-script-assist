import { DK_ENTITIES } from "./Entities";
import { XSyntaxToken } from "./interpreter/model/XToken";
import { CommandDesc } from "./model/CommandDesc";
import { CommandParam } from "./model/CommandParam";
import { Exp } from "./model/Exp";
import { LoadedCommand, LoadedCommands } from "./model/LoadedCommand";
import { OperatorType } from "./model/OperatorType";
import { ParamType } from "./model/ParamType";
import { RootLvl } from "./model/RootLvl";
import { SignChange } from "./model/SignChange";
import { CommandEffects, XCommandDesc } from "./model/XCommandDesc";
import { CommandEffectFactory } from "./model/XCommandEffect";
import { XDescParam } from "./model/XDescParam";
import { ResourcesLoader } from "./ResourcesLoader";
import { OPERATOR_TYPES } from "./TypeUtils";

let dkCmdParamsMap: Map<string, CommandDesc> | undefined;

const LOADED_COMMANDS: LoadedCommands = ResourcesLoader.loadCommands();

const CONSECUTIVE_NUM_TYPES = [
    ParamType.Number, ParamType.NonNegNumber, ParamType.Gold, ParamType.Lvl, ParamType.PowerLvl,
    ParamType.RoomAvailability, ParamType.Slab, ParamType.Subtile, ParamType.Time, ParamType.Byte, ParamType.OneToTen
];

export const COMPARISON_PARAMS: CommandParam[] = [
    {
        optional: false,
        allowedTypes: [
            ParamType.Flag, ParamType.Timer, ParamType.Global,
            ParamType.Creature, ParamType.Room, ParamType.Power,
            ParamType.Trap, ParamType.Door, ParamType.CustomBox,
            ParamType.CampaignFlag
        ]
    },
    {
        optional: false,
        allowedTypes: [ParamType.Number]
    },
];

export const AVAIL_COMPARISON_PARAMS: CommandParam[] = [
    {
        optional: false,
        allowedTypes: [
            ParamType.Creature, ParamType.Room, ParamType.Power,
            ParamType.Trap, ParamType.Door,
        ]
    },
    {
        optional: false,
        allowedTypes: [ParamType.Number]
    },
];

export const CONTROL_COMPARISON_PARAMS: CommandParam[] = [
    {
        optional: false,
        allowedTypes: [ParamType.Creature, ParamType.CreatureGlobal]
    },
    {
        optional: false,
        allowedTypes: [ParamType.Number]
    },
];

function initCmdParamsMap(loaded: LoadedCommands): Map<string, CommandDesc> {
    const result: Map<string, CommandDesc> = new Map;
    loaded.values.forEach(lv => {
        const openSymbolIndex = lv.cmd.match(/[([]/)?.index || 0;
        const name = lv.cmd.substring(0, openSymbolIndex).toUpperCase();
        result.set(name, loadedCommandToCommandDesc(lv, name));
    });
    return result;
}

function getDefaultCmdParamName(index: number) {
    return `value${index + 1}`;
}

function interpretSignParam(signPart: string): { name: string, params: string } {
    if (signPart.indexOf(":") === -1) {
        return {
            name: "",
            params: signPart.trim()
        };
    }
    return {
        name: signPart.split(":")[0].trim(),
        params: signPart.split(":")[1].trim(),
    };
}

function interpretSignChangeString(arg: string): SignChange {
    const parts = arg.split(" ");
    const check = parts[2] === "IN" ? "IN" : "EQ";
    const result: SignChange = {
        in: parseInt(parts[1]),
        check,
        out: parseInt(parts[5]),
        outTypes: interpretParamTypes(parts[6])
    };
    if (check === "EQ") {
        result.arg = parts[3];
    } else {
        result.typeArgs = interpretParamTypes(parts[3]);
    }
    return result;
}

function interpretParamTypes(arg: string): ParamType[] {
    return arg.split("/").map(t => t.trim()).sort() as ParamType[];
}

function getCmdDocMarkDown(loadCmd: LoadedCommand, name: string): string {
    return loadCmd.doc || "";
}

function getCommandsEffects(loadCmd: LoadedCommand): CommandEffects {
    const result: CommandEffects = [];
    const F = CommandEffectFactory;
    (loadCmd.condition === "PUSH" && result.push(F.conditionPush()));
    (loadCmd.condition === "POP" && result.push(F.conditionPop()));
    (loadCmd.timerWriteAt && result.push(F.timerWrite()));
    (loadCmd.timerReadAt && result.push(F.timerRead()));
    (loadCmd.flagWriteAt && result.push(F.flagWrite()));
    (loadCmd.flagReadAt && result.push(F.flagRead()));
    (loadCmd.apWriteAt != null && result.push(F.apWrite()));
    (loadCmd.apReadAt != null && result.push(F.apRead()));
    (loadCmd.partyAddAt != null && result.push(F.partyAdd()));
    (loadCmd.partyReadAt != null && result.push(F.partyRead()));
    (loadCmd.partyDeleteAt != null && result.push(F.partyDelete()));
    (loadCmd.wins != null && result.push(F.wins()));
    return result;
}

function decideOptionalStartingIndex(signParts: string[], optParam: number | undefined): number {
    if (optParam != null) {
        const referencedStrings = signParts.map(part => ({value: part}));
        const firstOptionalRef = referencedStrings
            .filter(part => part.value !== XSyntaxToken.ArgSep)
            .find((val, idx) => idx >= optParam);
        return referencedStrings.findIndex(refString => refString === firstOptionalRef);
    }
    return Number.MAX_SAFE_INTEGER;
}


function loadedCommandToCommandDesc(loadCmd: LoadedCommand, name: string): XCommandDesc {
    // ...(loadCmd.doc && { doc: getCmdDocMarkDown(loadCmd, name) }),

    const result: XCommandDesc = new XCommandDesc;
    result.effects = getCommandsEffects(loadCmd);
    const parts = [...(loadCmd.cmd.matchAll(/([([])(.*)([)\]])/g))][0];
    const openSymbol = parts[1];
    const sign = parts[2];

    const partArray = sign.replace(/[\[\]]+/g, "&").split("&").map(c => c.trim()).filter(Boolean);
    
    result.opts = loadCmd.opts || 0;
    result.bracketed = openSymbol === XSyntaxToken.BOpen;
    
    const optFromNonSepIndex = decideOptionalStartingIndex(partArray, loadCmd.opts);
    
    let nonSepArgIndex = - 1;
    for (let i = 0; partArray.length; i++) {
        nonSepArgIndex += (partArray[i] === XSyntaxToken.ArgSep) ? 0 : 1;
        const { name, params } = interpretSignParam(partArray[i]);
        const cmdParam: XDescParam = {
            allowedTypes: interpretParamTypes(params),
            optional: i >= optFromNonSepIndex,
            name: name || getDefaultCmdParamName(i)
        };
        result.pushPart(cmdParam);
        if (result.getParts().some(p => p instanceof XDescParam && p.allowedTypes.includes(ParamType.Auto))) {
            result.autoTypes = true;
        }
        const msgSlotPos = result.getParts().findIndex(p => p.allowedTypes.includes(ParamType.MsgNumber));
        if (msgSlotPos > -1) { result.msgSlotAt = msgSlotPos; }
        const newPartyPos = result.params.findIndex(p => p.allowedTypes.includes(ParamType.NewParty));
        if (newPartyPos > -1) { result.partyPutAt = newPartyPos; }
        const versionPos = result.params.findIndex(p => p.allowedTypes.includes(ParamType.Version));
        if (versionPos > -1) { result.versionPutAt = versionPos; }
    }
    if (loadCmd.signChanges) {
        result.signChanges = loadCmd.signChanges.map(interpretSignChangeString);
    }
    return result;
}

function typesAreConsecutive(targetTypes: ParamType[]) {
    return targetTypes.every(type => CONSECUTIVE_NUM_TYPES.includes(type));
}

function autoToAllowedTypes(mappedTypes: ParamType[], targetTypes: ParamType[]): ParamType[] {
    if (mappedTypes.indexOf(ParamType.Auto) === -1) {
        return mappedTypes;
    }
    if (typesAreConsecutive(targetTypes)) {
        return mappedTypes.filter(mt => mt !== ParamType.Auto).concat([ParamType.Number, ParamType.Range]);
    }
    return mappedTypes.filter(mt => mt !== ParamType.Auto).concat(targetTypes);
}

function getSignChangedCommandDesc(exp: Exp, desc: CommandDesc, changes: SignChange[]): CommandDesc {
    let result: CommandDesc = desc;
    let replace: boolean;
    let inValue: string;
    for (const sc of changes) {
        replace = false;
        inValue = exp.args[sc.in]?.value.toUpperCase();
        if (inValue) {
            if (sc.check === "EQ" && inValue === sc.arg?.toUpperCase()) {
                replace = true;
            } else if (sc.check === "IN" && sc.typeArgs) {
                const targetEntitites = sc.typeArgs.map(t => DK_ENTITIES[t]).flat().map(e => e.val);
                replace = targetEntitites.includes(inValue);
            }
            if (replace) {
                result = {
                    ...desc,
                    params: desc.params.map((p, i) => {
                        if (i === sc.out) {
                            return {
                                ...p,
                                allowedTypes: sc.outTypes
                            };
                        }
                        return p;
                    })
                };
            }
        }
    }
    return result;
}


export class DescProvider {
    static getCommandDescMap(): Map<string, CommandDesc> {
        if (!dkCmdParamsMap) {
            dkCmdParamsMap = initCmdParamsMap(LOADED_COMMANDS);
        }
        return dkCmdParamsMap;
    }

    static getCommandDesc(exp: string | Exp): CommandDesc | null {
        if (typeof exp === "string") {
            return DescProvider.getCommandDescMap().get(exp.toUpperCase()) || null;
        } else {
            const result = DescProvider.getCommandDescMap().get(exp.value.toUpperCase());
            if (result && result.signChanges) {
                return getSignChangedCommandDesc(exp, result, result.signChanges);
            }
            return result || null;
        }
    }

    static deriveCommandDesc(exp: Exp, allowedTypes: ParamType[]): CommandDesc | null {
        const operatorType = OPERATOR_TYPES[exp.value];
        if (operatorType === OperatorType.Relational) {
            if (allowedTypes.length === 1 && allowedTypes[0] === ParamType.Comparison) {
                return {
                    params: COMPARISON_PARAMS
                };
            }
            if (allowedTypes.length === 1 && allowedTypes[0] === ParamType.AvailabilityComparison) {
                return {
                    params: AVAIL_COMPARISON_PARAMS
                };
            }
            if (allowedTypes.length === 1 && allowedTypes[0] === ParamType.ControlComparison) {
                return {
                    params: CONTROL_COMPARISON_PARAMS
                };
            }
        } else if (operatorType === OperatorType.Arithmetic) {
            return {
                params: [
                    {
                        optional: false,
                        allowedTypes: [ParamType.Number]
                    },
                    {
                        optional: false,
                        allowedTypes: [ParamType.Number]
                    },
                ]
            };
        }
        if (!operatorType) {
            const cmdDesc: CommandDesc | null = DescProvider.getCommandDesc(exp);
            if (cmdDesc && cmdDesc.autoTypes) {
                return {
                    ...cmdDesc,
                    returns: allowedTypes,
                    params: cmdDesc.params.map(p => ({
                        ...p,
                        allowedTypes: autoToAllowedTypes(p.allowedTypes, allowedTypes)
                    }))
                };
            }
        }
        return null;
    }
}