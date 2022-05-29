import { DK_ENTITIES } from "./Entities";
import { XConst } from "./interpreter/model/XConst";
import { XExp } from "./interpreter/model/XExp";
import { XExp2 } from "./interpreter/model/XExp2";
import { XSyntaxToken } from "./interpreter/model/XToken";
import { CommandDesc } from "./model/CommandDesc";
import { Exp } from "./model/Exp";
import { LoadedCommand, LoadedCommands } from "./model/LoadedCommand";
import { ParamType } from "./model/ParamType";
import { XSignChange } from "./model/SignChange";
import { XCommandDesc } from "./model/XCommandDesc";
import { CommandEffect, CommandEffectFactory } from "./model/XCommandEffect";
import { XDescParam } from "./model/XDescParam";
import { ResourcesLoader } from "./ResourcesLoader";

let dkCmdParamsMap: Map<string, XCommandDesc> | undefined;

const LOADED_COMMANDS: LoadedCommands = ResourcesLoader.loadCommands();

const CONSECUTIVE_NUM_TYPES = [
    ParamType.Number, ParamType.NonNegNumber, ParamType.Gold, ParamType.Lvl, ParamType.PowerLvl,
    ParamType.RoomAvailability, ParamType.Slab, ParamType.Subtile, ParamType.Time, ParamType.Byte, ParamType.OneToTen
];


function initCmdParamsMap(loaded: LoadedCommands): Map<string, XCommandDesc> {
    const result: Map<string, XCommandDesc> = new Map;
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

function interpretSignChangeString(arg: string): XSignChange {
    // IF 1 EQ ROOM SET 2 ROOM
    const parts = arg.split(" ");
    const check = parts[2] === "IN" ? "IN" : "EQ";
    const result: XSignChange = new XSignChange({
        in: parseInt(parts[1]),
        check,
        out: parseInt(parts[5]),
        change: parts[6] === "MAKE_OPTIONAL" ? parts[6] : interpretParamTypes(parts[6])
    });
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

function decideOptionalStartingIndex(signParts: string[], optParam: number | undefined): number {
    if (optParam != null) {
        const referencedStrings = signParts.map(part => ({ value: part }));
        const firstOptionalRef = referencedStrings
            .filter(part => part.value !== XSyntaxToken.ArgSep)
            .find((val, idx) => idx >= optParam);
        return referencedStrings.findIndex(refString => refString === firstOptionalRef);
    }
    return Number.MAX_SAFE_INTEGER;
}

interface NonSepSignPart {
    signPart: string;
    preSep: boolean;
}

function signToNonSepSignParts(sign: string): NonSepSignPart[] {
    const result: NonSepSignPart[] = [];
    const partArray = sign.replace(/[\[\]]+/g, "&").split("&").filter(Boolean);
    let part: string;
    for (let i = 0; i < partArray.length; i++) {
        part = partArray[i];
        if (part !== XSyntaxToken.ArgSep) {
            result.push({
                signPart: part,
                preSep: partArray[i - 1] === XSyntaxToken.ArgSep
            });
        }
    }
    return result;
}


function loadedCommandToCommandDesc(loadCmd: LoadedCommand, name: string): XCommandDesc {
    // ...(loadCmd.doc && { doc: getCmdDocMarkDown(loadCmd, name) }),

    const result: XCommandDesc = {
        effects: CommandEffectFactory.fromLoadedCmd(loadCmd),
        bracketed: false,
        params: [],
        autoTypes: false,
        doc: "",
    };
    
    const parts = [...(loadCmd.cmd.matchAll(/([([])(.*)([)\]])/g))][0];
    const openSymbol = parts[1];
    const sign = parts[2];

    result.bracketed = openSymbol === XSyntaxToken.BOpen;

    
    const nonSepSignParts: NonSepSignPart[] = signToNonSepSignParts(sign);
    const optFromNonSepIndex = nonSepSignParts.length - (loadCmd.opts || 0);
    
    for (let i = 0; i < nonSepSignParts.length; i++) {
        const { name, params } = interpretSignParam(nonSepSignParts[i].signPart);
        const cmdParam: XDescParam = {
            allowedTypes: interpretParamTypes(params),
            optional: i >= optFromNonSepIndex,
            name: name || getDefaultCmdParamName(i),
            preSep: nonSepSignParts[i].preSep
        };
        result.params.push(cmdParam);
        if (result.params.some(p => p.allowedTypes.includes(ParamType.Auto))) {
            result.autoTypes = true;
        }
        const msgSlotPos = result.params.findIndex(p => p.allowedTypes.includes(ParamType.MsgNumber));
        if (msgSlotPos > -1) { result.effects!.msgSlot = msgSlotPos; }
        const newPartyPos = result.params.findIndex(p => p.allowedTypes.includes(ParamType.NewParty));
        if (newPartyPos > -1) { result.effects!.partyAdd = newPartyPos; }
        const versionPos = result.params.findIndex(p => p.allowedTypes.includes(ParamType.Version));
        if (versionPos > -1) { result.effects!.version = versionPos; }
    }
    if (loadCmd.signChanges) {
        result.signChanges = loadCmd.signChanges.map(interpretSignChangeString);
    }
    if (!Object.keys(result.effects || {}).length) { delete result.effects; }
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

// function getSignChangedCommandDesc(exp: XExp, desc: XCommandDesc, changes: SignChange[]): XCommandDesc {
//     let result: XCommandDesc = desc;
//     let replace: boolean;
//     let inValue: XConst | XExp | null | undefined;
//     for (const sc of changes) {
//         replace = false;
//         inValue = exp.getChildByIndex(sc.in)?.arg;
//         if (inValue && inValue instanceof XConst) {
//             if (sc.check === "EQ" && inValue.val === sc.arg?.toUpperCase()) {
//                 replace = true;
//             } else if (sc.check === "IN" && sc.typeArgs) {
//                 const targetEntitites = sc.typeArgs.map(t => DK_ENTITIES[t]).flat().map(e => e.val);
//                 replace = targetEntitites.includes(inValue.val);
//             }
//             if (replace) {
//                 result = new XCommandDesc;
//                 Object.assign(result, desc);
//                 result.params = desc.params.map((p, i) => {
//                     if (i === sc.out) {
//                         return {
//                             ...p,
//                             allowedTypes: sc.outTypes
//                         };
//                     }
//                     return p;
//                 });
//             }
//         }
//     }
//     return result;
// }


export class XDescProvider {
    static getCommandDescMap(): Map<string, XCommandDesc> {
        if (!dkCmdParamsMap) {
            dkCmdParamsMap = initCmdParamsMap(LOADED_COMMANDS);
        }
        return dkCmdParamsMap;
    }

    static getCommandDesc(arg: string): XCommandDesc | undefined {
        return XDescProvider.getCommandDescMap().get(arg.toUpperCase());
    }

    static getCommandDescForExp(exp: XExp2): XCommandDesc | undefined {
        const desc = XDescProvider.getCommandDescMap().get(exp.caller.val.toUpperCase());
        if (desc?.signChanges) {
            let paramsCopy: XDescParam[] = [...desc.params];
            for (const change of desc.signChanges) {
                paramsCopy = change.applySignParamsChange(exp, paramsCopy);
            }
            return {
                ...desc,
                params: paramsCopy,
            };
        }
        return desc;
        // return XDescProvider.getCommandDescMap().get(name.toUpperCase()) || null;
    }

    // static getCommandDesc(exp: string | Exp): CommandDesc | null {
    //     if (typeof exp === "string") {
    //         return DescProvider.getCommandDescMap().get(exp.toUpperCase()) || null;
    //     } else {
    //         const result = DescProvider.getCommandDescMap().get(exp.value.toUpperCase());
    //         if (result && result.signChanges) {
    //             return getSignChangedCommandDesc(exp, result, result.signChanges);
    //         }
    //         return result || null;
    //     }
    // }

    // static deriveCommandDesc(exp: Exp, allowedTypes: ParamType[]): CommandDesc | null {
    //     const operatorType = OPERATOR_TYPES[exp.value];
    //     if (operatorType === OperatorType.Relational) {
    //         if (allowedTypes.length === 1 && allowedTypes[0] === ParamType.Comparison) {
    //             return {
    //                 params: COMPARISON_PARAMS
    //             };
    //         }
    //         if (allowedTypes.length === 1 && allowedTypes[0] === ParamType.AvailabilityComparison) {
    //             return {
    //                 params: AVAIL_COMPARISON_PARAMS
    //             };
    //         }
    //         if (allowedTypes.length === 1 && allowedTypes[0] === ParamType.ControlComparison) {
    //             return {
    //                 params: CONTROL_COMPARISON_PARAMS
    //             };
    //         }
    //     } else if (operatorType === OperatorType.Arithmetic) {
    //         return {
    //             params: [
    //                 {
    //                     optional: false,
    //                     allowedTypes: [ParamType.Number]
    //                 },
    //                 {
    //                     optional: false,
    //                     allowedTypes: [ParamType.Number]
    //                 },
    //             ]
    //         };
    //     }
    //     if (!operatorType) {
    //         const cmdDesc: CommandDesc | null = DescProvider.getCommandDesc(exp);
    //         if (cmdDesc && cmdDesc.autoTypes) {
    //             return {
    //                 ...cmdDesc,
    //                 returns: allowedTypes,
    //                 params: cmdDesc.params.map(p => ({
    //                     ...p,
    //                     allowedTypes: autoToAllowedTypes(p.allowedTypes, allowedTypes)
    //                 }))
    //             };
    //         }
    //     }
    //     return null;
    // }
}