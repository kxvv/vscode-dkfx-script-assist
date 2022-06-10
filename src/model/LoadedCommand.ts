export interface LoadedCommand {
    cmd: string;
    opts?: number;
    condition?: "PUSH" | "POP";
    timerReadAt?: [number, number];
    timerWriteAt?: [number, number];
    flagReadAt?: [number, number];
    flagWriteAt?: [number, number];
    apReadAt?: number;
    apWriteAt?: number;
    signChanges?: string[];
    returns?: string;
    doc?: string;
    reuses?: boolean;
    rootLvl?: string;
    wins?: boolean;
    partyAddAt?: number;
    partyReadAt?: number;
    partyDeleteAt?: number;
}

export interface LoadedCommands {
    values: LoadedCommand[];
}
