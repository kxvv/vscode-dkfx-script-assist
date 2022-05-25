import { DescProvider } from "./DescProvider";
import { XExp } from "./interpreter/model/XExp";
import { XExpChildSlot } from "./interpreter/model/XExpChildSlot";
import { MappersDk } from "./MappersDk";
import { DkSuggestion } from "./model/DkSuggestion";
import { ParamType } from "./model/ParamType";
import { ScriptAnalysis } from "./model/ScriptAnalysis";
import { Statement } from "./model/Statement";
import { LineMap } from "./ScriptInstance";
import { TypeUtils } from "./TypeUtils";
import { Utils } from "./Utils";

export class SuggestionHelper {
    private static cachedCommands: DkSuggestion[] = [];
    static getSuggestionsForParamTypes(state: ScriptAnalysis, types: ParamType[]): DkSuggestion[] {
        return types.map(t => TypeUtils.suggestForType(state, t)).flat();
    }

    static suggestCommand(LineMap: LineMap, lineNumber: number): DkSuggestion[] {
        if (!this.cachedCommands.length) {
            this.cachedCommands = [...DescProvider.getCommandDescMap().entries()]
                .filter(([name, desc]) => {
                    return !desc.returns;
                })
                .map(([name, desc]) => MappersDk.commandToDkSuggestion(name, desc));
        }
        // TODO do not suggest non if-able commands while in if
        return this.cachedCommands;
    }

    static getExpChildSlotByPos(exp: XExp, pos: number): XExpChildSlot | null {
        if (Utils.isBetween(pos, exp.start, exp.end)) {
            
        }
        return null;
    }
}