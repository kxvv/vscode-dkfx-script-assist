import { ErrSeverity } from "./ErrSeverity";

export interface DkDiag {
    line: number;
    start: number;
    end: number;
    msg: string;
    severity: ErrSeverity;
}