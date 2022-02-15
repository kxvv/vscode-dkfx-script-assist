import { TokenType } from "./TokenType";

export interface Token {
    val: string;
    start: number;
    end: number;
    type: TokenType;
}