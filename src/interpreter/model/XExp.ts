// import { SyntaxToken } from "../Tokenizer";
// import { Err } from "../model/Err";
// import { TokenType } from "../model/TokenType";
// import { XToken } from "./XToken";

import { SyntaxToken } from "../../Tokenizer";
import { XToken } from "./XToken";
import { XExpChildSlot } from "./XExpChildSlot";
import { XExpChildSep } from "./XExpChildSep";
import { Utils } from "../../Utils";

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

    public isPosInCall(pos: number): boolean {
        if (this.children.length) {
            return Utils.isBetween(pos, this.children[0].start, Utils.arrayPeek(this.children)!.end);
        }
        return false;
    }

    public getLeafExp(pos: number): XExp | null {
        const stack: XExp[] = [this];
        let result: XExp | null = null;
        while (stack.length) {
            result = stack.pop() || null;
            if (result && result.isPosInCall(pos)) {
                for (const child of result.getChildren()) {
                    // TODO also consider trailing?
                    if (child instanceof XExpChildSlot && child.arg instanceof XExp) {
                        if (child.arg.isPosInCall(pos)) {
                            stack.push(child.arg);
                            break;
                        }
                    }
                }
            } else {
                result = null;
            }
        }
        return result;
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
