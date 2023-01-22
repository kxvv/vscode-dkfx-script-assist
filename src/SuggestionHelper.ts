import { MappersDk } from "./MappersDk";
import { DkSuggestion } from "./model/DkSuggestion";
import { DescParam } from "./model/DescParam";
import { ScriptAnalysis } from "./model/ScriptAnalysis";
import { LineMap } from "./ScriptInstance";
import { TypeTools } from "./TypeTools";
import { DescProvider } from "./DescProvider";
import { Exp } from "./model/Exp";

export class SuggestionHelper {
    private static cachedCommands: DkSuggestion[] = [];

    public static suggestParams(analysis: ScriptAnalysis, paramDesc: DescParam | null, leafExp?: Exp | null, index?: number): DkSuggestion[] {
        return paramDesc ? paramDesc.allowedTypes
            .map(t => TypeTools.toolFor(t).suggest(analysis, leafExp, index))
            .flat() : [];
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