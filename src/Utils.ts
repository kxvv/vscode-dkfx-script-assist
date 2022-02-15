import { SyntaxToken } from "./Tokenizer";

export class Utils {
    static isBetween(val: number, lw: number, hi: number): boolean {
        return val >= lw && val <= hi;
    }

    static getDefaultCmdParamName(index: number) {
        return `value${index + 1}`;
    }

    static getParens(bracketed?: boolean): [SyntaxToken, SyntaxToken] {
        return bracketed ? [SyntaxToken.BOpen, SyntaxToken.BClose] : [SyntaxToken.POpen, SyntaxToken.PClose];
    }
}
