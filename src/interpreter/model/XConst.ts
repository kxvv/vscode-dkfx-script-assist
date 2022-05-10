import { XToken } from "./XToken";
import { XArgSlot } from "./XArgSlot";

export class XConst {
    val: string;
    start: number;
    end: number;
    parent: XArgSlot;

    constructor(val: string, start: number, parent: XArgSlot) {
        this.val = val;
        this.start = start;
        this.end = start + val.length;
        this.parent = parent;
    }
}