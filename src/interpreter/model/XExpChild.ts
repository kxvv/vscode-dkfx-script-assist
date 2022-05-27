import { XToken } from "./XToken";
import { XExp2 } from "./XExp2";
import { XConst2 } from "./XConst2";

export class XExpChild {
    parent: XExp2;
    val: XExp2 | XConst2 | null = null;
    start: number;
    end: number;
    preSep: XToken | null;

    constructor(parent: XExp2, start: number, end = Number.MAX_SAFE_INTEGER) {
        this.parent = parent;
        this.start = start;
        this.end = end;
    }
}