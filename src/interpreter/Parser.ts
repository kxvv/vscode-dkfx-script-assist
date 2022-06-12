import { ErrorInvalidStatement, ErrorOpeningAndClosingTokensMismatch, ErrorUnexpectedOpeningToken, ErrorUnterminatedExpression } from "../model/DKError";
import { Exp, RangeExp } from "../model/Exp";
import { Operator } from "../model/Operators";
import { ParsedLine } from "../model/ParsedLine";
import { Token } from "../model/Token";
import { TokenGroup } from "../model/TokenGroup";
import { TokenType } from "../model/TokenType";
import { Word } from "../model/Word";
import { PreparsedStatement } from "./Preparser";

export class Parser {

    static parse(st: PreparsedStatement): ParsedLine {
        if (st.tokens.length) {
            const tokens: (Token | TokenGroup)[] = [...st.tokens]; // expects tokens to be comment-free
            const result: ParsedLine = new ParsedLine;
            if (st.comment) { result.comment = st.comment; }

            for (let i = 2; i < tokens.length; i++) {
                result.pushError(new ErrorInvalidStatement(tokens[i]));
            }

            if (tokens[0] instanceof Token && tokens[0].type === TokenType.Word) {
                if (tokens.length === 1) {
                    result.exp = new Word(null, tokens[0].val, tokens[0].start);
                } else if (tokens[1] instanceof TokenGroup) {
                    result.exp = Parser.parseGroup(tokens[1], tokens[0], result);
                } else if (tokens[1]) {
                    result.pushError(new ErrorInvalidStatement(tokens[1]));
                }
            } else {
                result.pushError(new ErrorInvalidStatement(tokens[0]));
            }

            return result;
        }
        return new ParsedLine;
    }

    private static parseGroup(group: TokenGroup, caller: Token, futureLine: ParsedLine): Exp {
        const result: Exp = new Exp(caller, group.opener, group.closer);
        if (group.closer && !group.isParensMatching()) {
            futureLine.pushError(new ErrorOpeningAndClosingTokensMismatch(group.closer));
        }
        let i = 0;
        let token: Token | TokenGroup;
        let nextToken: Token | TokenGroup;
        let nextToken2: Token | TokenGroup;

        while (i < group.tokens.length) {
            token = group.tokens[i];
            nextToken = group.tokens[i + 1];

            if (token instanceof Token) {
                if (nextToken instanceof TokenGroup) {
                    result.pushExp(Parser.parseGroup(nextToken, token, futureLine));
                    i += 2;
                } else {
                    if (nextToken?.val === Operator.Rng && (nextToken2 = group.tokens[i + 2]) && nextToken2 instanceof Token) {
                        result.pushExp(new RangeExp(token, nextToken, nextToken2));
                        i += 3;
                    } else {
                        result.pushToken(token);
                        i++;
                    }
                }
            } else {
                result.pushExp(Parser.parseGroup(token, token.opener, futureLine));
                i++;
                futureLine.pushError(new ErrorUnexpectedOpeningToken(token.opener));
            }
        }
        if (!result.closer) {
            futureLine.pushError(new ErrorUnterminatedExpression(caller));
        }
        return result;
    }
}