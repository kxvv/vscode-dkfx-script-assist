import { Operator } from "../../model/Operators";
import { XExp } from "./XExp";

export class XArgSep {
    parent: XExp | null = null;
    val: Operator | ",";
    start: number;
    end: number;

    constructor(val: Operator | ",", start: number) {
        this.val = val;
        this.start = start;
        this.end = val.length + start;
    }
}