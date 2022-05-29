import { SyntaxToken } from "./Tokenizer";

export class Utils {
    static arrayPeek<T>(arg: Array<T>): T | undefined {
        return arg[arg.length-1];
    }

    static isBetween(val: number, lw: number, hi: number): boolean {
        return val >= lw && val <= hi;
    }

    static isParsedBetween(val: string, lw: number, hi: number): boolean {
        return Utils.isBetween(parseInt(val), lw, hi);
    }

    static getDefaultCmdParamName(index: number) {
        return `value${index + 1}`;
    }

    static getParens(bracketed?: boolean): [SyntaxToken, SyntaxToken] {
        return bracketed ? [SyntaxToken.BOpen, SyntaxToken.BClose] : [SyntaxToken.POpen, SyntaxToken.PClose];
    }
}
