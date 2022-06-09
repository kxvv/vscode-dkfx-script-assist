import { DescProvider } from "../../DescProvider";
import { CommandDesc } from "../../model/CommandDesc";
import { ParamType } from "../../model/ParamType";
import { Utils } from "../../Utils";
import { ExpChild } from "./ExpChild";
import { Token } from "./Token";
import { Word } from "./Word";

interface ChildSearchByCursorPosition {
    child: ExpChild | null;
    index: number;
    leaf: Exp | null;
    ahead: boolean;
}

export class Exp {
    private children: ExpChild[];
    caller: Token;
    start: number;
    end: number;
    opener: Token;
    closer: Token | null;
    parent: ExpChild | null = null;
    desc?: CommandDesc;

    constructor(caller: Token, opener: Token, closer: Token | null = null) {
        this.caller = caller;
        this.start = caller.start;
        this.end = closer?.end || Number.MAX_SAFE_INTEGER;
        this.opener = opener;
        this.closer = closer;
        this.children = [new ExpChild(this, opener.end, this.closer?.start || Number.MAX_SAFE_INTEGER)];
    }

    public pushExp(arg: Exp) {
        const lastChild: ExpChild = Utils.arrayPeek(this.children)!;
        let newborn: ExpChild;

        if (lastChild.val) {
            lastChild.end = lastChild.val.end;
            newborn = new ExpChild(this, lastChild.end, this.closer?.start || Number.MAX_SAFE_INTEGER);
            newborn.val = arg;
            arg.parent = newborn;
            this.children.push(newborn);
        } else {
            lastChild.val = arg;
            arg.parent = lastChild;
        }
    }

    public pushToken(arg: Token) {
        let newborn: ExpChild;
        const lastChild: ExpChild = Utils.arrayPeek(this.children)!;
        if (arg.isSeparating()) {
            newborn = new ExpChild(this, arg.end, this.closer?.start || Number.MAX_SAFE_INTEGER);
            newborn.preSep = arg;
            this.children.push(newborn);
            lastChild.end = arg.start;
        } else {
            if (lastChild.val) {
                lastChild.end = lastChild.val.end;
                newborn = new ExpChild(this, lastChild.end, this.closer?.start || Number.MAX_SAFE_INTEGER);
                newborn.val = new Word(newborn, arg.val, arg.start);
                this.children.push(newborn);
                if (arg.isOperator()) {
                    newborn.end = arg.end;
                    newborn = new ExpChild(this, newborn.end, this.closer?.start || Number.MAX_SAFE_INTEGER);
                    this.children.push(newborn);
                }
            } else {
                lastChild.val = new Word(lastChild, arg.val, arg.start);
            }
        }
    }

    public getChildren() {
        return this.children;
    }

    public getChild(index: number): ExpChild {
        return this.children[index];
    }

    public getChildsWord(index: number): Word | null {
        const child: ExpChild | undefined = this.children[index];
        if (child && child.val instanceof Word) {
            return child.val;
        }
        return null;
    }

    public getDesc(): CommandDesc | undefined {
        return this.desc || (this.desc = DescProvider.getCommandDescForExp(this));
    }

    public isPosInCall(pos: number): boolean {
        return !!this.children.length && Utils.isBetween(pos, this.children[0].start, Utils.arrayPeek(this.children)!.end);
    }

    public getLeafExp(pos: number): Exp | null {
        const stack: Exp[] = [this];
        let result: Exp | null = null;
        while (stack.length) {
            result = stack.pop() || null;
            if (result && result.isPosInCall(pos)) {
                for (const child of result.getChildren()) {
                    if (child.val instanceof Exp) {
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

    private getChildAtPosition(pos: number): [ExpChild | null, number] {
        const target: Exp | null = this.getLeafExp(pos);
        let child: ExpChild;
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

export class RangeExp extends Exp {
    constructor(left: Token, operator: Token, right: Token) {
        super(operator, operator, operator);
        this.start = left.start;
        this.end = right.end;
        this.getChildren().pop();

        let child: ExpChild;
        child = new ExpChild(this, left.start, left.end);
        child.val = new Word(child, left.val, left.start);
        this.getChildren().push(child);
        child = new ExpChild(this, right.start, right.end);
        child.val = new Word(child, right.val, right.start);
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
