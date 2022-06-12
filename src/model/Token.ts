import { OPERATORS, Operator } from "./Operators";
import { TokenType } from "./TokenType";

export enum SyntaxToken {
    POpen = "(",
    PClose = ")",
    BOpen = "[",
    BClose = "]",
    ArgSep = ",",
};

export interface TokenIndexMap {
    [key: number]: Token;
}

export class Token {
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
        return this.val === ",";
    }

    isOperator(): boolean {
        return OPERATORS.includes(this.val as Operator);
    }
}