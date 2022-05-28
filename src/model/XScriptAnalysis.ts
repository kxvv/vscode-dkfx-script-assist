import { XError } from "../interpreter/model/XError";
import { XExp2 } from "../interpreter/model/XExp2";
import { DkDiag } from "./DkDiag";
import { ErrSeverity } from "./ErrSeverity";

interface Party {
    name: string;
    declareXExp2: {
        line: number;
        XExp2: XExp2;
    };
    adds: {
        line: number;
        XExp2: XExp2;
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

export class XScriptAnalysis {
    diags: DkDiag[] = [];
    parties: Party[] = [];
    timerWrites: VarAlter[] = [];
    timerReads: VarAlter[] = [];
    flagWrites: VarAlter[] = [];
    flagReads: VarAlter[] = [];
    apWrites: VarAlter[] = [];
    apReads: VarAlter[] = [];
    msgSlots: { [slot: number | string]: MsgSlot[] };
    versionWrites: VarAlter[] = [];
    winsCount: number;
    diagIgnoreLines: number[] = [];

    pushParseErrors(line: number, errs: XError[] = []) {
        for (const err of errs) {
            this.diags.push({
                start: err.start,
                end: err.end,
                line,
                msg: err.msg,
                severity: ErrSeverity.Error,
            });
        }
    }
}