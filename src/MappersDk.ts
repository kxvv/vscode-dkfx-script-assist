import { CommandDesc } from "./model/CommandDesc";
import { DkEntity } from "./model/DkEntity";
import { DkSuggestion } from "./model/DkSuggestion";
import { SuggestionKind } from "./model/SuggestionKind";

export class MappersDk {
    static entityToDkSuggestion(e: DkEntity, preselect = false, kind = SuggestionKind.EnumMember): DkSuggestion {
        const result: DkSuggestion = {
            label: e.val,
            kind,
            preselect: preselect,
        };
        if (e.doc) {
            result.documentation = e.doc;
        }
        return result;
    }

    static textToDkSuggestion(text: string, preselect = false, kind = SuggestionKind.EnumMember): DkSuggestion {
        const result: DkSuggestion = {
            label: text,
            kind,
            preselect: preselect,
        };
        return result;
    }

    static commandToDkSuggestion(name: string, desc: CommandDesc): DkSuggestion {
        const result: DkSuggestion = {
            label: name,
            kind: SuggestionKind.Method,
        };
        if (desc.doc) {
            result.documentation = desc.doc;
        }
        return result;
    }
}
