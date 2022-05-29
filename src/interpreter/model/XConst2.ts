import { XCommandDesc } from "../../model/XCommandDesc";
import { XDescProvider } from "../../XDescProvider";
import { XExpChild } from "./XExpChild";

export class XConst2 {
    val: string;
    start: number;
    end: number;
    parent: XExpChild | null;

    constructor(parent: XExpChild | null, val: string, start: number) {
        this.val = val;
        this.start = start;
        this.end = start + val.length;
        this.parent = parent;
    }

    public getDesc(): XCommandDesc | undefined {
        return XDescProvider.getCommandDesc(this.val);
    }
}