// import { SyntaxToken } from "../Tokenizer";
// import { Err } from "../model/Err";
// import { TokenType } from "../model/TokenType";
// import { XToken } from "./XToken";

import { SyntaxToken } from "../../Tokenizer";
import { XToken } from "./XToken";
import { XArgSlot } from "./XArgSlot";
import { XArgSep } from "./XArgSep";

export class XExp {
    private slotSep: (XArgSlot | XArgSep)[] = [];
    caller: XToken;
    start: number;
    end: number;
    opener: XToken;
    closer: XToken | null;
    parent: XArgSlot | null = null;

    constructor(caller: XToken, opener: XToken, closer: XToken | null = null) {
        this.caller = caller;
        this.start = caller.start;
        this.end = caller.start + caller.val.length;
        this.opener = opener;
        this.closer = closer;
    }

    public pushToExpSlot(arg: XArgSlot | XArgSep) {
        this.slotSep.push(arg);
        arg.parent = this;
        return this;
    }

    public getSlotSep() {
        return this.slotSep;
    }

    public getSlot(index: number): XArgSlot | undefined {
        // @ts-ignore
        return this.slotSep.filter(s => s instanceof XArgSlot)[index];
    }
}

// export class XExp {
//     args: (XExp | XToken)[];
//     value: string;
//     start: number;
//     end: number;
//     parseErrors?: Err[];
//     active?: boolean;
//     meta?: string;
//     opens?: SyntaxToken;
// }
