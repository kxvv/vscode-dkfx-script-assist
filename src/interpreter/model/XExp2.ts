// import { SyntaxToken } from "../Tokenizer";
// import { Err } from "../model/Err";
// import { TokenType } from "../model/TokenType";
// import { XToken } from "./XToken";
import { XToken } from "./XToken";
import { Utils } from "../../Utils";
import { XExpChild } from "./XExpChild";
import { XConst2 } from "./XConst2";
import { XCommandDesc } from "../../model/XCommandDesc";
import { XDescProvider } from "../../XDescProvider";

export class XExp2 {
    private children: XExpChild[];
    caller: XToken;
    start: number;
    end: number;
    opener: XToken;
    closer: XToken | null;
    parent: XExpChild | null = null;
    desc?: XCommandDesc;

    constructor(caller: XToken, opener: XToken, closer: XToken | null = null) {
        this.caller = caller;
        this.start = caller.start;
        this.end = closer?.end || Number.MAX_SAFE_INTEGER;
        this.opener = opener;
        this.closer = closer;
        this.children = [new XExpChild(this, opener.end, this.closer?.start || Number.MAX_SAFE_INTEGER)];
    }

    public pushExp(arg: XExp2) {
        const lastChild: XExpChild = Utils.arrayPeek(this.children)!;
        let newborn: XExpChild;

        if (lastChild.val) {
            lastChild.end = lastChild.val.end;
            newborn = new XExpChild(this, lastChild.end, this.closer?.start || Number.MAX_SAFE_INTEGER);
            newborn.val = arg;
            arg.parent = newborn;
            this.children.push(newborn);
        } else {
            lastChild.val = arg;
            arg.parent = lastChild;
        }
    }

    public pushToken(arg: XToken) {
        let newborn: XExpChild;
        const lastChild: XExpChild = Utils.arrayPeek(this.children)!;
        if (arg.isSeparating()) {
            newborn = new XExpChild(this, arg.end, this.closer?.start || Number.MAX_SAFE_INTEGER);
            newborn.preSep = arg;
            this.children.push(newborn);
            lastChild.end = arg.start;
        } else {
            if (lastChild.val) {
                lastChild.end = lastChild.val.end;
                newborn = new XExpChild(this, lastChild.end, this.closer?.start || Number.MAX_SAFE_INTEGER);
                newborn.val = new XConst2(newborn, arg.val, arg.start);
                this.children.push(newborn);
            } else {
                lastChild.val = new XConst2(lastChild, arg.val, arg.start);
            }
        }
    }

    public getChildren() {
        return this.children;
    }

    public getChild(index: number): XExpChild | undefined {
        return this.children[index];
    }

    public getChildsConst(index: number): XConst2 | null {
        const child: XExpChild | undefined = this.children[index];
        if (child && child.val instanceof XConst2) {
            return child.val;
        }
        return null;
    }

    public getDesc(): XCommandDesc | undefined {
        return this.desc || (this.desc = XDescProvider.getCommandDescForExp(this));
    }

    public isPosInCall(pos: number): boolean {
        return !!this.children.length && Utils.isBetween(pos, this.children[0].start, Utils.arrayPeek(this.children)!.end);
    }

    // public getLeafExp(pos: number): XExp | null {
    //     const stack: XExp[] = [this];
    //     let result: XExp | null = null;
    //     while (stack.length) {
    //         result = stack.pop() || null;
    //         if (result && result.isPosInCall(pos)) {
    //             for (const child of result.getChildren()) {
    //                 // TODO also consider trailing?
    //                 if (child instanceof XExpChildSlot && child.arg instanceof XExp) {
    //                     if (child.arg.isPosInCall(pos)) {
    //                         stack.push(child.arg);
    //                         break;
    //                     }
    //                 }
    //             }
    //         } else {
    //             result = null;
    //         }
    //     }
    //     return result;
    // }
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
