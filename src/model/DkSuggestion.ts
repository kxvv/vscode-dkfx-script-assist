export interface DkSuggestion {
    label: string;
    preselect?: boolean;
    description?: string;
    kind?: number; 
    documentation?: string;
    insertText?: string;
}