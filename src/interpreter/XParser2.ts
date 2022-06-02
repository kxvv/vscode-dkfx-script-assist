import { Operator } from "../model/Operators";
import { TokenType } from "../model/TokenType";
import { TokenGroup } from "./model/TokenGroup";
import { XExpChildSep } from "./model/XExpChildSep";
import { XExpChildSlot } from "./model/XExpChildSlot";
import { ErrorInvalidStatement, ErrorOpeningAndClosingTokensMismatch, ErrorUnexpectedOpeningToken, ErrorUnterminatedExpression } from "./model/XError";
import { XParsedLine2 } from "./model/XParsedLine";
import { XToken } from "./model/XToken";
import { PreparsedStatement } from "./Preparser";
import { RangeExp, XExp2 } from "./model/XExp2";
import { XConst2 } from "./model/XConst2";
import { XExpChild } from "./model/XExpChild";

export class XParser2 {

    static parse(st: PreparsedStatement): XParsedLine2 {
        if (st.tokens.length) {
            const tokens: (XToken | TokenGroup)[] = [...st.tokens]; // expects tokens to be comment-free
            const result: XParsedLine2 = new XParsedLine2;
            if (st.comment) { result.comment = st.comment; }

            for (let i = 2; i < tokens.length; i++) {
                result.pushError(new ErrorInvalidStatement(tokens[i]));
            }

            if (tokens[0] instanceof XToken && tokens[0].type === TokenType.Word) {
                if (tokens.length === 1) {
                    result.exp = new XConst2(null, tokens[0].val, tokens[0].start);
                } else if (tokens[1] instanceof TokenGroup) {
                    result.exp = XParser2.parseGroup(tokens[1], tokens[0], result);
                } else if (tokens[1]) {
                    result.pushError(new ErrorInvalidStatement(tokens[1]));
                }
            } else {
                result.pushError(new ErrorInvalidStatement(tokens[0]));
            }

            return result;
        }
        return new XParsedLine2;
    }

    private static parseGroup(group: TokenGroup, caller: XToken, futureLine: XParsedLine2): XExp2 {
        const result: XExp2 = new XExp2(caller, group.opener, group.closer);
        if (group.closer && !group.isParensMatching()) {
            futureLine.pushError(new ErrorOpeningAndClosingTokensMismatch(group.closer));
        }
        let i = 0;
        let token: XToken | TokenGroup;
        let nextToken: XToken | TokenGroup;
        let nextToken2: XToken | TokenGroup;

        while (i < group.tokens.length) {
            token = group.tokens[i];
            nextToken = group.tokens[i + 1];

            if (token instanceof XToken) {
                if (nextToken instanceof TokenGroup) {
                    result.pushExp(XParser2.parseGroup(nextToken, token, futureLine));
                    i += 2;
                } else {
                    if (nextToken?.val === Operator.Rng && (nextToken2 = group.tokens[i + 2]) && nextToken2 instanceof XToken) {
                        result.pushExp(new RangeExp(token, nextToken, nextToken2));
                        i += 3;
                    } else {
                        result.pushToken(token);
                        i++;
                    }
                }
            } else {
                result.pushExp(XParser2.parseGroup(token, token.opener, futureLine));
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