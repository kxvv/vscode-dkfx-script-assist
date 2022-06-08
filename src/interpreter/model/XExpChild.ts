import { XToken } from "./XToken";
import { XExp2 } from "./XExp2";
import { XWord } from "./XWord";
import { XDescParam } from "../../model/XDescParam";

export class XExpChild {
    parent: XExp2;
    val: XExp2 | XWord | null = null;
    start: number;
    end: number;
    preSep: XToken | null;

    constructor(parent: XExp2, start: number, end = Number.MAX_SAFE_INTEGER) {
        this.parent = parent;
        this.start = start;
        this.end = end;
    }

    getDescParam(): XDescParam | null {
        const siblings = this.parent.getChildren();
        for (let i = 0; i < (this.parent.getDesc()?.params.length || 0); i++) {
            if (siblings[i] === this) {
                return this.parent.getDesc()!.params[i];
            }
        }
        return null;
    }
}