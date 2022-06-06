import { MappersDk } from "./MappersDk";
import { DkSuggestion } from "./model/DkSuggestion";
import { XDescParam } from "./model/XDescParam";
import { XScriptAnalysis } from "./model/XScriptAnalysis";
import { LineMap } from "./ScriptInstance";
import { TypeTools } from "./TypeTools";
import { XDescProvider } from "./XDescProvider";

export class SuggestionHelper {
    private static cachedCommands: DkSuggestion[] = [];

    public static suggestParams(analysis: XScriptAnalysis, paramDesc: XDescParam | null): DkSuggestion[] {
        return paramDesc ? paramDesc.allowedTypes
            .map(t => TypeTools.utilFor(t).suggest(analysis))
            .flat() : [];
    }

    static suggestCommand(LineMap: LineMap, lineNumber: number): DkSuggestion[] {
        if (!this.cachedCommands.length) {
            this.cachedCommands = [...XDescProvider.getCommandDescMap().entries()]
                .filter(([name, desc]) => {
                    return !desc.returns;
                })
                .map(([name, desc]) => MappersDk.commandToDkSuggestion(name, desc));
        }
        // TODO do not suggest non if-able commands while in if
        return this.cachedCommands;
    }
}