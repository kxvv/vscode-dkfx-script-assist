export interface ExtConfig {
    diagEnabled: boolean;
    diagReactionTime: number;
    customTraps: string[];
    customDoors: string[];
    customCreatures: string[];
    customObjects: string[];
    formatter: ExtConfigFormatter;
}

export interface ExtConfigFormatter {
    spaceAfterSeparator: boolean;
    spacesAroundOperator: boolean;
    indentationString: string;
}
