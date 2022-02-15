import { CommandDesc } from "./model/CommandDesc";
import { DkEntity } from "./model/DkEntity";
import { DkSuggestion } from "./model/DkSuggestion";
import { RootLvl } from "./model/RootLvl";

export class MappersDk {
    static entityToDkSuggestion(e: DkEntity, preselect = "", kind = 0): DkSuggestion {
        const result: DkSuggestion = {
            label: e.val,
            kind: kind || 19, // enum
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
            kind: 1, // method
        };
        if (desc.doc) {
            result.documentation = desc.doc;
        }
        return result;
    }
}
