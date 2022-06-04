import { Operator, OPERATORS } from "../../model/Operators";
import { Token } from "../../model/Token";
import { TokenType } from "../../model/TokenType";

export enum XSyntaxToken {
    POpen = "(",
    PClose = ")",
    BOpen = "[",
    BClose = "]",
    ArgSep = ",",
};

export interface XTokenIndexMap {
    [key: number]: XToken;
}

export class XToken {
    val: string;
    start: number;
    end: number;
    type: TokenType;

    constructor(val: string, start: number, type: TokenType) {
        this.val = val;
        this.start = start;
        this.end = start + val.length;
        this.type = type;
    }

    isSeparating() {
        return this.val === ","; // TODO remove this || OPERATORS.includes(this.val as Operator);
    }

    isOperator(): boolean {
        return OPERATORS.includes(this.val as Operator);
    }
}