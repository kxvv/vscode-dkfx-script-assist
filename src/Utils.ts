import { SyntaxToken } from "./model/Token";

export class Utils {
    static arrayPeek<T>(arg: Array<T>): T | undefined {
        return arg[arg.length - 1];
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

    static compare(str1?: string, str2?: string): boolean {
        return str1 == null || str2 == null ? false : str1.toUpperCase() === str2.toUpperCase();
    }
}
