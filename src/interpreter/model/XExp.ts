// import { SyntaxToken } from "../Tokenizer";
// import { Err } from "../model/Err";
// import { TokenType } from "../model/TokenType";
// import { XToken } from "./XToken";

import { SyntaxToken } from "../../Tokenizer";
import { XToken } from "./XToken";
import { XExpChildSlot } from "./XExpChildSlot";
import { XExpChildSep } from "./XExpChildSep";

export class XExp {
    private children: (XExpChildSlot | XExpChildSep)[] = [];
    caller: XToken;
    start: number;
    end: number;
    opener: XToken;
    closer: XToken | null;
    parent: XExpChildSlot | null = null;

    constructor(caller: XToken, opener: XToken, closer: XToken | null = null) {
        this.caller = caller;
        this.start = caller.start;
        this.end = caller.start + caller.val.length;
        this.opener = opener;
        this.closer = closer;
    }

    public pushChild(arg: XExpChildSlot | XExpChildSep) {
        this.children.push(arg);
        arg.parent = this;
        return this;
    }

    public getChildren() {
        return this.children;
    }

    public getChildByIndex(index: number): XExpChildSlot | undefined {
        // @ts-ignore
        return this.children.filter(s => s instanceof XExpChildSlot)[index];
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
