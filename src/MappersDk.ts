import { CommandDesc } from "./model/CommandDesc";
import { DkEntity } from "./model/DkEntity";
import { DkSuggestion } from "./model/DkSuggestion";
import { SuggestionKind } from "./model/SuggestionKind";

export class MappersDk {
    static entityToDkSuggestion(e: DkEntity, preselect = "", kind: SuggestionKind = 0): DkSuggestion {
        const result: DkSuggestion = {
            label: e.val,
            kind: kind || SuggestionKind.EnumMember,
            preselect: e.val === preselect,
        };
        if (e.doc) {
            result.documentation = e.doc;
        }
        return result;
    }

    static commandToDkSuggestion(name: string, desc: CommandDesc): DkSuggestion {
        const result: DkSuggestion = {
            label: name,
            kind: SuggestionKind.Method, // method
        };
        if (desc.doc) {
            result.documentation = desc.doc;
        }
        return result;
    }
}
