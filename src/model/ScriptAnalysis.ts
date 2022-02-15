import { DkDiag } from "./DkDiag";
import { Exp } from "./Exp";

interface Party {
    name: string;
    declareExp: {
        line: number;
        exp: Exp;
    };
    adds: {
        line: number;
        exp: Exp;
    }[];
    reads: number;
    dels: number;
}

interface VarAlter {
    player: string;
    varname: string;
    line: number;
    start: number;
    end: number;
}

interface MsgSlot {
    line: number;
    start: number;
    end: number;
}

export interface ScriptAnalysis {
    diags: DkDiag[];
    parties: Party[];
    timerWrites: VarAlter[];
    timerReads: VarAlter[];
    flagWrites: VarAlter[];
    flagReads: VarAlter[];
    apWrites: VarAlter[];
    apReads: VarAlter[];
    msgSlots: { [slot: number | string]: MsgSlot[] };
    versionWrites: VarAlter[];
    winsCount: number;
    diagIgnoreLines: number[];
}