import { Operator } from "../model/Operators";
import { TokenType } from "../model/TokenType";
import { TokenGroup } from "./model/TokenGroup";
import { XArgSep } from "./model/XArgSep";
import { XArgSlot } from "./model/XArgSlot";
import { ErrorInvalidStatement, ErrorOpeningAndClosingTokensMismatch, ErrorUnexpectedOpeningToken, ErrorUnterminatedExpression } from "./model/XError";
import { XExp } from "./model/XExp";
import { XParsedLine } from "./model/XParsedLine";
import { XToken } from "./model/XToken";
import { PreparsedStatement } from "./Preparser";

export class XParser {

    static parse(st: PreparsedStatement): XParsedLine {
        if (st.tokens.length) {
            const tokens: (XToken | TokenGroup)[] = [...st.tokens]; // expects tokens to be comment-free
            const result: XParsedLine = new XParsedLine;
            if (st.comment) { result.comment = st.comment; }

            for (let i = 2; i < tokens.length; i++) {
                result.pushError(new ErrorInvalidStatement(tokens[i]));
            }

            if (tokens[0] instanceof XToken && tokens[0].type === TokenType.Word) {
                if (tokens.length === 1) {
                    result.exp = tokens[0];
                } else if (tokens[1] instanceof TokenGroup) {
                    result.exp = XParser.parseGroup(tokens[1], tokens[0], result);
                } else if (tokens[1]) {
                    result.pushError(new ErrorInvalidStatement(tokens[1]));
                }
            } else {
                result.pushError(new ErrorInvalidStatement(tokens[0]));
            }

            return result;
        }
        return new XParsedLine;
    }

    private static parseGroup(group: TokenGroup, caller: XToken, futureLine: XParsedLine): XExp {
        const result: XExp = new XExp(caller, group.opener, group.closer);
        if (!group.isParensMatching() && group.closer) {
            futureLine.pushError(new ErrorOpeningAndClosingTokensMismatch(group.closer));
        }
        let i = 0;
        let token: XToken | TokenGroup;
        let nextToken: XToken | TokenGroup;
        let argSlot: XArgSlot = new XArgSlot(group.opener.end);

        while (i < group.tokens.length) {
            token = group.tokens[i];

            if (token instanceof XToken) {
                nextToken = group.tokens[i + 1];
                if (nextToken instanceof TokenGroup) {
                    argSlot.pushToSlot(XParser.parseGroup(nextToken, token, futureLine));
                    i += 2;
                } else {
                    if (token.isSeparating()) {
                        argSlot.end = token.start;
                        result.pushToExpSlot(argSlot);
                        result.pushToExpSlot(new XArgSep(token.val as (Operator | ","), token.start));
                        argSlot = new XArgSlot(token.end);
                    } else {
                        argSlot.pushToSlot(token);
                    }
                    i++;
                }
                // if (token.type === TokenType.)
            } else {
                argSlot.pushToSlot(XParser.parseGroup(token, token.opener, futureLine));
                i++;
                futureLine.pushError(new ErrorUnexpectedOpeningToken(token.opener));
            }
        }
        if (group.closer) {
            argSlot.end = group.closer.start;
        } else {
            futureLine.pushError(new ErrorUnterminatedExpression(caller));
        }
        result.pushToExpSlot(argSlot);

        return result;
    }
}