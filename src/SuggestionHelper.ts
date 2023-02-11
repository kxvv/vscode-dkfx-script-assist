import { DescProvider } from "./DescProvider";
import { MappersDk } from "./MappersDk";
import { DescParam } from "./model/DescParam";
import { DkSuggestion } from "./model/DkSuggestion";
import { Exp } from "./model/Exp";
import { ScriptAnalysis } from "./model/ScriptAnalysis";
import { LineMap } from "./ScriptInstance";
import { TypeTools } from "./TypeTools";

export class SuggestionHelper {
    private static cachedCommands: DkSuggestion[] = [];

    public static suggestParams(analysis: ScriptAnalysis, paramDesc: DescParam | null, leafExp?: Exp | null, index?: number): DkSuggestion[] {
        const result = paramDesc ? paramDesc.allowedTypes
            .map(t => TypeTools.toolFor(t).suggest(analysis, leafExp, index))
            .flat() : [];
        return result;
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
}