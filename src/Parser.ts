import { ErrMsg } from "./model/ErrMsg";
import { Exp } from "./model/Exp";
import { Statement } from "./model/Statement";
import { Token } from "./model/Token";
import { TokenType } from "./model/TokenType";
import { SyntaxToken } from "./Tokenizer";

interface ParseExpCallArgs {
    tokens: Token[];
    from: number;
    callerToken: Token | null;
    bgnPos: number;
    opToken: SyntaxToken;
}

const tokenToExp = (token: Token): Exp => {
    return {
        args: [],
        start: token.start,
        end: token.end,
        value: token.val,
        bgnPos: token.start,
        endPos: token.end,
    };
};

const mergeExps = (exps: Exp[], currentToken: Token): Exp => {
    if (exps.length) {
        const operatorIndex = exps.findIndex(e => e.meta === TokenType.Operator || e.meta === TokenType.OperatorIncomplete);
        if (operatorIndex !== -1) {
            const exp1 = exps[0];
            const exp3 = exps[2];
            if (operatorIndex === 1 && exps.length == 3 && !exp1.meta && !exp3.meta) {
                if (exps[1].meta === TokenType.OperatorIncomplete) {
                    return {
                        start: exps[1].start,
                        end: exps[1].end,
                        bgnPos: exps[1].start,
                        endPos: exps[1].end,
                        value: "",
                        args: [],
                        parseErrors: [{
                            msg: ErrMsg.ParseUnknownOperator
                        }]
                    };
                }
                return {
                    start: exp1.start,
                    end: exp3.end,
                    bgnPos: exp1.start,
                    endPos: exp3.end,
                    value: exps[1].value,
                    args: [exp1, exp3]
                };
            }
            return {
                start: exps[0].start,
                end: exps[exps.length - 1].end,
                bgnPos: exps[0].start,
                endPos: exps[exps.length - 1].end,
                value: "",
                args: [],
                parseErrors: [{
                    msg: ErrMsg.ParseOperatorForm
                }]
            };
        } else if (exps.length > 1) {
            return {
                args: [],
                start: exps[1].start,
                end: exps[1].end,
                bgnPos: exps[1].start,
                endPos: exps[1].end,
                value: "",
                parseErrors: [{
                    msg: ErrMsg.ParseExpectedSep
                }]
            };
        }
        return exps[0];
    }
    return {
        args: [],
        start: currentToken.start,
        end: currentToken.end,
        bgnPos: currentToken.start,
        endPos: currentToken.end,
        value: "",
        parseErrors: [
            {
                msg: ErrMsg.ParseEmptyParam
            },
        ]
    };
};

const initiateExp = ({ tokens, from, callerToken, bgnPos, opToken }: ParseExpCallArgs): Exp => {
    const result: Exp = {
        start: callerToken ? callerToken.start : tokens[from - 1].start,
        end: Number.MAX_SAFE_INTEGER,
        bgnPos: bgnPos,
        endPos: Number.MAX_SAFE_INTEGER,
        args: [],
        value: callerToken ? callerToken.val : "",
        opens: opToken
    };
    if (!callerToken) {
        result.parseErrors = [{
            msg: ErrMsg.ParseUnexpectedOpening
        }];
    }
    return result;
};

const parseExpCall = ({ tokens, from, callerToken, bgnPos, opToken }: ParseExpCallArgs): Exp => {
    const result: Exp = initiateExp({ tokens, from, callerToken, bgnPos, opToken });
    let bgnPosMark = bgnPos;
    let expStack: Exp[] = [];
    let e: Exp | undefined;
    let temp: Exp;
    let t: Token;
    let i = from;
    while (i < tokens.length) {
        t = tokens[i];
        e = expStack[expStack.length - 1];
        if (t.type === TokenType.Syntactic) {
            if (t.val === SyntaxToken.POpen || t.val === SyntaxToken.BOpen) {
                if (e && tokens[i - 1].type === TokenType.Word) {
                    e = parseExpCall({ tokens, from: i + 1, callerToken: tokens[i - 1], bgnPos: t.end, opToken: t.val });
                    expStack.pop();
                    expStack.push(e);
                } else {
                    e = parseExpCall({ tokens, from: i + 1, callerToken: null, bgnPos: t.end, opToken: t.val });
                    expStack.pop();
                    expStack.push(e);
                }
                i = tokens.findIndex(tkn => tkn.end === e!.end);
                if (i === -1) {
                    break;
                }
            }
            if (t.val === SyntaxToken.PClose || t.val === SyntaxToken.BClose) {
                temp = mergeExps(expStack, t);
                temp.bgnPos = bgnPosMark;
                temp.endPos = t.start;
                bgnPosMark = t.end;
                result.args.push(temp);
                result.end = t.end;
                result.endPos = t.start;
                if (
                    (opToken === SyntaxToken.POpen && t.val === SyntaxToken.BClose) ||
                    (opToken === SyntaxToken.BOpen && t.val === SyntaxToken.PClose)
                ) {
                    if (!result.parseErrors) { result.parseErrors = []; }
                    result.parseErrors.push({
                        start: t.start,
                        end: t.end,
                        msg: ErrMsg.ParseParensMismatch
                    });
                }
                return result;
            }
            if (t.val === SyntaxToken.ArgSep) {
                temp = mergeExps(expStack, t);
                temp.bgnPos = bgnPosMark;
                temp.endPos = t.start;
                bgnPosMark = t.end;
                result.args.push(temp);
                expStack = [];
            }
        } else {
            if (t.type === TokenType.Operator || t.type === TokenType.OperatorIncomplete) {
                expStack.push({
                    ...tokenToExp(t),
                    meta: t.type
                });
            } else {
                expStack.push(tokenToExp(t));
            }
        }
        i++;
    }
    temp = mergeExps(expStack, tokens[tokens.length - 1]);
    temp.bgnPos = bgnPosMark;
    temp.endPos = Number.MAX_SAFE_INTEGER;
    result.args.push(temp);
    if (!result.parseErrors) {
        result.parseErrors = [];
    }
    result.parseErrors.push({
        msg: ErrMsg.ParseUnterminatedExp
    });
    return result;
};

export class Parser {
    /*
     * expects that if there are any comments, they will be in a single, last token
     */
    static parseLineTokens(tokens: Token[]): Statement {
        if (!tokens.length) {
            return {};
        }
        if (tokens.length && tokens[0].type === TokenType.Comment) {
            return {
                comment: tokens[0].val
            };
        }
        const result: Statement = {};
        if (tokens[tokens.length - 1].type === TokenType.Comment) {
            result.comment = tokens.pop()!.val;
        }
        if (tokens[0].type === TokenType.Word) {
            result.exp = {
                args: [],
                start: tokens[0].start,
                end: tokens[0].end,
                value: tokens[0].val,
                bgnPos: tokens[0].end,
                endPos: tokens[0].end,
            };
            if (!tokens[1]) {
                return result;
            }
            if (tokens[1].val === SyntaxToken.POpen) {
                result.exp = parseExpCall({
                    tokens,
                    callerToken: tokens[0],
                    from: 2,
                    bgnPos: tokens[1].end,
                    opToken: SyntaxToken.POpen
                });
                result.exp.bgnPos = result.exp.value.length + result.exp.start + 1;
                result.exp.endPos = result.exp.end === Number.MAX_SAFE_INTEGER ? result.exp.end : result.exp.end - 1;
            }
            const extraToken = tokens.find(t => t.start >= result.exp!.end);
            if (extraToken) {
                if (!result.exp.parseErrors) {
                    result.exp.parseErrors = [];
                }
                result.exp.parseErrors.push({
                    msg: extraToken.type === TokenType.Word ?
                        ErrMsg.ParseBadStatement : `${ErrMsg.ParseUnexpectedToken} ('${extraToken.val}')`,
                    start: extraToken.start,
                    end: tokens[tokens.length - 1].end
                });
            }
        } else {
            result.exp = {
                args: [],
                start: tokens[0].start,
                end: tokens[0].end,
                value: tokens[0].val,
                parseErrors: [{
                    msg: `${ErrMsg.ParseUnexpectedToken} ('${tokens[0].val}')`,
                    start: tokens[0].start,
                    end: tokens[0].end
                }],
                bgnPos: tokens[0].end,
                endPos: tokens[0].end,
            };
        }
        return result;
    }
}

