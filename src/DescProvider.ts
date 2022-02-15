import { DK_ENTITIES } from "./Entities";
import { CommandDesc } from "./model/CommandDesc";
import { CommandParam } from "./model/CommandParam";
import { Exp } from "./model/Exp";
import { LoadedCommand, LoadedCommands } from "./model/LoadedCommand";
import { OperatorType } from "./model/OperatorType";
import { ParamType } from "./model/ParamType";
import { RootLvl } from "./model/RootLvl";
import { SignChange } from "./model/SignChange";
import { ResourcesLoader } from "./ResourcesLoader";
import { OPERATOR_TYPES } from "./TypeUtils";

let dkCmdParamsMap: Map<string, CommandDesc> | undefined;

const LOADED_COMMANDS: LoadedCommands = ResourcesLoader.loadCommands();

const CONSECUTIVE_NUM_TYPES = [
    ParamType.Number, ParamType.NonNegNumber, ParamType.Gold, ParamType.Lvl, ParamType.PowerLvl,
    ParamType.RoomAvailability, ParamType.Slab, ParamType.Subtile, ParamType.Time, ParamType.Byte
];

export const COMPARISON_PARAMS: CommandParam[] = [
    {
        optional: false,
        allowedTypes: [
            ParamType.Flag, ParamType.Timer, ParamType.Global,
            ParamType.Creature, ParamType.Room, ParamType.Power,
            ParamType.Trap, ParamType.Door, ParamType.CustomBox
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

function loadedCommandToCommandDesc(loadCmd: LoadedCommand, name: string): CommandDesc {
    const result: CommandDesc = {
        params: [],
        ...(loadCmd.condition === "PUSH" && { isConditionPush: true }),
        ...(loadCmd.condition === "POP" && { isConditionPop: true }),
        ...(loadCmd.timerWriteAt != null && { timerWriteAt: loadCmd.timerWriteAt }),
        ...(loadCmd.timerReadAt != null && { timerReadAt: loadCmd.timerReadAt }),
        ...(loadCmd.flagWriteAt != null && { flagWriteAt: loadCmd.flagWriteAt }),
        ...(loadCmd.flagReadAt != null && { flagReadAt: loadCmd.flagReadAt }),
        ...(loadCmd.apReadAt != null && { apReadAt: loadCmd.apReadAt }),
        ...(loadCmd.apWriteAt != null && { apWriteAt: loadCmd.apWriteAt }),
        ...(loadCmd.partyAddAt != null && { partyAddAt: loadCmd.partyAddAt }),
        ...(loadCmd.partyReadAt != null && { partyReadAt: loadCmd.partyReadAt }),
        ...(loadCmd.partyDeleteAt != null && { partyDeleteAt: loadCmd.partyDeleteAt }),
        ...(loadCmd.signChanges != null && { signChanges: [] }),
        ...(loadCmd.doc && { doc: getCmdDocMarkDown(loadCmd, name) }),
        ...(loadCmd.decorates && { decorates: true }),
        ...(loadCmd.rootLvl && { rootLvl: loadCmd.rootLvl as RootLvl }),
        ...(loadCmd.wins && { wins: true }),
        ...(loadCmd.returns != null && { returns: interpretParamTypes(loadCmd.returns) }),
    };
    const parts = [...(loadCmd.cmd.matchAll(/([([])(.*)([)\]])/g))][0];
    const openSymbol = parts[1];
    const sign = parts[2];
    const signParts = sign.split(",").map(signPart => signPart.trim());
    result.opts = loadCmd.opts || 0;
    if (openSymbol === "[") { result.bracketed = true; }
    for (let i = 0; sign && i < signParts.length; i++) {
        const { name, params } = interpretSignParam(signParts[i]);
        const optionalFromIndex = signParts.length - (loadCmd.opts || 0);
        const cmdParam: CommandParam = {
            allowedTypes: interpretParamTypes(params),
            optional: i >= optionalFromIndex,
            name: name || getDefaultCmdParamName(i)
        };
        result.params.push(cmdParam);
        if (result.params.some(p => p.allowedTypes.includes(ParamType.Auto))) {
            result.autoTypes = true;
        }
        const msgSlotPos = result.params.findIndex(p => p.allowedTypes.includes(ParamType.MsgNumber));
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
            if (sc.check === "EQ" && inValue === sc.arg) {
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