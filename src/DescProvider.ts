import { Exp } from "./interpreter/model/Exp";
import { XSyntaxToken } from "./interpreter/model/Token";
import { LoadedCommand, LoadedCommands } from "./model/LoadedCommand";
import { ParamType } from "./model/ParamType";
import { SignOptChange, XSignChange } from "./model/SignChange";
import { CommandDesc } from "./model/CommandDesc";
import { CommandEffectFactory } from "./model/CommandEffect";
import { DescParam } from "./model/DescParam";
import { ResourcesLoader } from "./ResourcesLoader";

let dkCmdParamsMap: Map<string, CommandDesc> | undefined;

const LOADED_COMMANDS: LoadedCommands = ResourcesLoader.loadCommands();

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

function interpretSignChangeString(arg: string): XSignChange {
    // 0:IF 1:1 2:EQ 3:ROOM 4:SET 5:2 6:ROOM
    const parts = arg.split(" ");
    const check = parts[2] === "EQ" ? "EQ" : "IN";
    const result: XSignChange = new XSignChange({
        in: parseInt(parts[1]),
        check,
        out: parseInt(parts[5]),
    });
    if ([SignOptChange.Optional, SignOptChange.Required].includes(parts[6] as SignOptChange)) {
        result.optChange = parts[6] as SignOptChange;
    } else {
        result.change = interpretParamTypes(parts[6]);
    }
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


function loadedCommandToCommandDesc(loadCmd: LoadedCommand, name: string): CommandDesc {
    const result: CommandDesc = {
        effects: CommandEffectFactory.fromLoadedCmd(loadCmd),
        bracketed: false,
        params: [],
        autoTypes: false,
        doc: loadCmd.doc || "",
    };

    const parts = [...(loadCmd.cmd.matchAll(/([([])(.*)([)\]])/g))][0];
    const openSymbol = parts[1];
    const sign = parts[2];

    result.bracketed = openSymbol === XSyntaxToken.BOpen;


    const nonSepSignParts: NonSepSignPart[] = signToNonSepSignParts(sign);
    const optFromNonSepIndex = nonSepSignParts.length - (loadCmd.opts || 0);

    for (let i = 0; i < nonSepSignParts.length; i++) {
        const { name, params } = interpretSignParam(nonSepSignParts[i].signPart);
        const cmdParam: DescParam = {
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
    loadCmd.signChanges && (result.signChanges = loadCmd.signChanges.map(interpretSignChangeString));
    loadCmd.returns && (result.returns = interpretParamTypes(loadCmd.returns));
    if (!Object.keys(result.effects || {}).length) { delete result.effects; }
    return result;
}


export class DescProvider {
    static getCommandDescMap(): Map<string, CommandDesc> {
        if (!dkCmdParamsMap) {
            dkCmdParamsMap = initCmdParamsMap(LOADED_COMMANDS);
        }
        return dkCmdParamsMap;
    }

    static getCommandDesc(arg: string): CommandDesc | undefined {
        return DescProvider.getCommandDescMap().get(arg.toUpperCase());
    }

    static getCommandDescForExp(exp: Exp): CommandDesc | undefined {
        let desc = DescProvider.getCommandDesc(exp.caller.val);
        if (desc?.autoTypes && exp.parent) {
            const parentParam = exp.parent.getDescParam();
            if (parentParam) {
                desc = this.replaceAutoTypes({ ...desc }, exp, parentParam);
            }
        }
        if (desc?.signChanges) {
            let paramsCopy: DescParam[] = [...desc.params];
            for (const change of desc.signChanges) {
                paramsCopy = change.applySignParamsChange(exp, paramsCopy);
            }
            return {
                ...desc,
                params: paramsCopy,
            };
        }
        return desc;
    }

    private static replaceAutoTypes(descCopy: CommandDesc, exp: Exp, parentParam: DescParam): CommandDesc {
        let isConsecutive = parentParam.allowedTypes.includes(ParamType.Number) || parentParam.allowedTypes.includes(ParamType.Byte);
        if (String(descCopy.returns) === String([ParamType.Auto])) {
            descCopy.returns = parentParam.allowedTypes;
        }
        descCopy.params = descCopy.params.map(p => {
            const result: DescParam = { ...p };
            if (String(p.allowedTypes) === String([ParamType.Auto])) {
                result.allowedTypes = isConsecutive ? parentParam.allowedTypes.concat(ParamType.Range) : parentParam.allowedTypes;
            }
            return result;
        });
        return descCopy;
    }
}