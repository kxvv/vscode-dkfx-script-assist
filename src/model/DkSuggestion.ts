import { SuggestionKind } from "./SuggestionKind";

export interface DkSuggestion {
    label: string;
    preselect?: boolean;
    description?: string;
    kind?: SuggestionKind | number;
    documentation?: string;
    insertText?: string;
}