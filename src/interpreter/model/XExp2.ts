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
import { ParamType } from "../../model/ParamType";

interface ChildSearchByCursorPosition {
    child: XExpChild | null;
    index: number;
    leaf: XExp2 | null;
    ahead: boolean;
}

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
                if (arg.isOperator()) {
                    newborn.end = arg.end;
                    newborn = new XExpChild(this, newborn.end, this.closer?.start || Number.MAX_SAFE_INTEGER);
                    this.children.push(newborn);
                }
            } else {
                lastChild.val = new XConst2(lastChild, arg.val, arg.start);
            }
        }
    }

    public getChildren() {
        return this.children;
    }

    public getChild(index: number): XExpChild {
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

    public getLeafExp(pos: number): XExp2 | null {
        const stack: XExp2[] = [this];
        let result: XExp2 | null = null;
        while (stack.length) {
            result = stack.pop() || null;
            if (result && result.isPosInCall(pos)) {
                for (const child of result.getChildren()) {
                    if (child.val instanceof XExp2) {
                        if (child.val.isPosInCall(pos)) {
                            stack.push(child.val);
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

    private getChildAtPosition(pos: number): [XExpChild | null, number] {
        const target: XExp2 | null = this.getLeafExp(pos);
        let child: XExpChild;
        if (target) {
            for (let i = this.children.length - 1; i >= 0; i--) {
                child = this.children[i];
                if (pos >= child.start && pos <= child.end) {
                    return [child, i];
                }
            }
        }
        return [null, -1];
    }



    public getChildAtCursorPosition(pos: number): ChildSearchByCursorPosition {
        // get command at the top of the stack based on cursor's position
        // e.g. for cursor between 'a' and 'b', foo(x, y , bar( a b ), 44) gets exp bar
        const leaf = this.getLeafExp(pos);
        const result: ChildSearchByCursorPosition = { child: null, index: -1, leaf, ahead: false };
        if (leaf) {
            // identify a child at the cursor and also get its index
            const [child, index] = leaf.getChildAtPosition(pos);
            // if the actual value's end is before the slot's end
            // this indicates a space was pressed: next child does not exist
            // but cursor points at the later param
            result.ahead = !!child?.val && (child.val.end < child.end);
            result.child = child;
            result.index = index;
        }
        return result;
    }
}

export class RangeExp extends XExp2 {
    constructor(left: XToken, operator: XToken, right: XToken) {
        super(operator, operator, operator);
        this.start = left.start;
        this.end = right.end;
        this.getChildren().pop();

        let child: XExpChild;
        child = new XExpChild(this, left.start, left.end);
        child.val = new XConst2(child, left.val, left.start);
        this.getChildren().push(child);
        child = new XExpChild(this, right.start, right.end);
        child.val = new XConst2(child, right.val, right.start);
        this.getChildren().push(child);

        this.desc = {
            bracketed: false,
            autoTypes: false,
            doc: "",
            returns: [ParamType.Range],
            params: [
                {
                    allowedTypes: [ParamType.Number],
                    name: "left",
                    optional: false,
                    preSep: false,
                },
                {
                    allowedTypes: [ParamType.Number],
                    name: "right",
                    optional: false,
                    preSep: false,
                }
            ]
        };
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
