import { XToken } from "./XToken";
import { XExpChildSlot } from "./XExpChildSlot";

export class XConst {
    val: string;
    start: number;
    end: number;
    parent: XExpChildSlot;

    constructor(val: string, start: number, parent: XExpChildSlot) {
        this.val = val;
        this.start = start;
        this.end = start + val.length;
        this.parent = parent;
    }
}