import { SyntaxToken } from "../Tokenizer";
import { Err } from "./Err";

export interface Exp {
    args: Exp[];
    value: string;
    start: number;
    end: number;
    bgnPos: number;
    endPos: number;
    parseErrors?: Err[];
    active?: boolean;
    meta?: string;
    opens?: SyntaxToken;
}
