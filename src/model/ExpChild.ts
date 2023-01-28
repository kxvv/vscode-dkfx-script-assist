import { DescParam } from "./DescParam";
import { Exp } from "./Exp";
import { Token } from "./Token";
import { Word } from "./Word";

export class ExpChild {
    parent: Exp;
    val: Exp | Word | null = null;
    start: number;
    end: number;
    preSep: Token | null;

    constructor(parent: Exp, start: number, end = Number.MAX_SAFE_INTEGER) {
        this.parent = parent;
        this.start = start;
        this.end = end;
    }

    getDescParam(): DescParam | null {
        const siblings = this.parent.getChildren();
        for (let i = 0; i < (this.parent.getDesc()?.params.length || 0); i++) {
            if (siblings[i] === this) {
                return this.parent.getDesc()!.params[i];
            }
        }
        return null;
    }

    getPreceedingSibling(): ExpChild | undefined {
        const siblings = this.parent.getChildren();
        for (let i = 0; i < (this.parent.getChildren().length || 0); i++) {
            if (siblings[i] === this) {
                return siblings[i-1];
            }
        }
        return undefined;
    }
}