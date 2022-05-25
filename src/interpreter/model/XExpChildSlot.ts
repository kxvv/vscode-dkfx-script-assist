import { XToken } from "./XToken";
import { XConst } from "./XConst";
import { XExp } from "./XExp";

export class XExpChildSlot {
    parent: XExp | null = null;
    arg: XExp | XConst | null = null;
    start: number;
    end: number;
    trailing?: (XExp | XConst)[];

    constructor(start: number, end = Number.MAX_SAFE_INTEGER) {
        this.start = start;
        this.end = end;
    }

    pushToSlot(arg: XExp | XConst | XToken) {
        if (arg instanceof XToken) {
            this.pushToSlot(new XConst(arg.val, arg.start, this));
        } else {
            if (this.arg) {
                this.trailing = this.trailing || [];
                this.trailing.push(arg);
            } else {
                this.arg = arg;
            }
            arg.parent = this;
        }
        return this;
    }
}