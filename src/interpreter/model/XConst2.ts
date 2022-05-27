import { XExpChild } from "./XExpChild";

export class XConst2 {
    val: string;
    start: number;
    end: number;
    parent: XExpChild;

    constructor(parent: XExpChild, val: string, start: number) {
        this.val = val;
        this.start = start;
        this.end = start + val.length;
        this.parent = parent;
    }
}