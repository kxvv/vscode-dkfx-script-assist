import * as assert from "assert";
import { TokenGroup } from "../../interpreter/model/TokenGroup";
import { XExpChildSep } from "../../interpreter/model/XExpChildSep";
import { XExpChildSlot } from "../../interpreter/model/XExpChildSlot";
import { ErrorInvalidStatement, ErrorUnexpectedOpeningToken, ErrorUnterminatedExpression } from "../../interpreter/model/XError";
import { XExp } from "../../interpreter/model/XExp";
import { XParsedLine } from "../../interpreter/model/XParsedLine";
import { XSyntaxToken, XToken } from "../../interpreter/model/XToken";
import { PreparsedStatement } from "../../interpreter/Preparser";
import { XParser } from "../../interpreter/XParser";
import { Operator } from "../../model/Operators";
import { TokenType } from "../../model/TokenType";
import { TestUtils } from "./TestUtils";

suite("Suite for XParser::" + XParser.parse.name, () => {
    test("f( four ) rem hi", () => {
        const callerToken: XToken = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 1);
        const closerToken: XToken = TestUtils.createXToken(XSyntaxToken.PClose, 8);
        const arg: XToken = TestUtils.createXToken("four", 3, TokenType.String);
        const comment: XToken = TestUtils.createXToken("rem hi", 10, TokenType.Comment);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup(
                    [arg],
                    openerToken,
                    closerToken,
                )
            ],
        );
        st.comment = comment;
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        {
            const exp: XExp = new XExp(callerToken, openerToken, closerToken);
            const argSlot: XExpChildSlot = new XExpChildSlot(2, 8);
            argSlot.pushToSlot(arg);
            exp.pushChild(argSlot);
            expected.exp = exp;
            expected.comment = comment;
        }
        assert.deepStrictEqual(result, expected);
    });

    test("f(four  > f0ur)", () => {
        const callerToken: XToken = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 1);
        const closerToken: XToken = TestUtils.createXToken(XSyntaxToken.PClose, 14);
        const arg1: XToken = TestUtils.createXToken("four", 2, TokenType.String);
        const argSep: XToken = TestUtils.createXToken(Operator.Gt, 8, TokenType.Operator);
        const arg2: XToken = TestUtils.createXToken("f0ur", 10, TokenType.String);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup(
                    [arg1, argSep, arg2],
                    openerToken,
                    closerToken,
                )
            ]
        );
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        {
            const exp: XExp = new XExp(callerToken, openerToken, closerToken);
            let argSlot: XExpChildSlot;

            argSlot = new XExpChildSlot(2, 8);
            argSlot.pushToSlot(arg1);
            exp.pushChild(argSlot);

            exp.pushChild(new XExpChildSep(Operator.Gt, 8));

            argSlot = new XExpChildSlot(9, 14);
            argSlot.pushToSlot(arg2);
            exp.pushChild(argSlot);

            expected.exp = exp;
        }
        assert.deepStrictEqual(result, expected);
    });

    test("f(  )", () => {
        const callerToken: XToken = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 1);
        const closerToken: XToken = TestUtils.createXToken(XSyntaxToken.PClose, 4);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup(
                    [],
                    openerToken,
                    closerToken,
                )
            ]
        );
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        {
            const exp: XExp = new XExp(callerToken, openerToken, closerToken);
            let argSlot: XExpChildSlot;

            argSlot = new XExpChildSlot(2, 4);
            exp.pushChild(argSlot);

            expected.exp = exp;
        }
        assert.deepStrictEqual(result, expected);
    });

    test("f(,, argg,)", () => {
        const callerToken: XToken = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 1);
        const closerToken: XToken = TestUtils.createXToken(XSyntaxToken.PClose, 10);
        const argSep1: XToken = TestUtils.createXToken(XSyntaxToken.ArgSep, 2);
        const argSep2: XToken = TestUtils.createXToken(XSyntaxToken.ArgSep, 3);
        const arg: XToken = TestUtils.createXToken("argg", 5, TokenType.String);
        const argSep3: XToken = TestUtils.createXToken(XSyntaxToken.ArgSep, 9);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup(
                    [argSep1, argSep2, arg, argSep3],
                    openerToken,
                    closerToken,
                )
            ]
        );
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        {
            const exp: XExp = new XExp(callerToken, openerToken, closerToken);
            let argSlot: XExpChildSlot;

            argSlot = new XExpChildSlot(2, 2);
            exp.pushChild(argSlot);

            exp.pushChild(new XExpChildSep(argSep1.val as Operator, argSep1.start));

            argSlot = new XExpChildSlot(3, 3);
            exp.pushChild(argSlot);

            exp.pushChild(new XExpChildSep(argSep2.val as Operator, argSep2.start));

            argSlot = new XExpChildSlot(4, 9);
            argSlot.pushToSlot(arg);
            exp.pushChild(argSlot);

            exp.pushChild(new XExpChildSep(argSep3.val as Operator, argSep3.start));

            argSlot = new XExpChildSlot(10, 10);
            exp.pushChild(argSlot);

            expected.exp = exp;
        }

        assert.deepStrictEqual(result, expected);
    });

    test("f(, ", () => {
        const callerToken: XToken = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 1);
        const argSep: XToken = TestUtils.createXToken(XSyntaxToken.ArgSep, 2);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup(
                    [argSep],
                    openerToken,
                )
            ]
        );
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        {
            const exp: XExp = new XExp(callerToken, openerToken);
            let argSlot: XExpChildSlot;

            argSlot = new XExpChildSlot(2, 2);
            exp.pushChild(argSlot);

            exp.pushChild(new XExpChildSep(argSep.val as Operator, argSep.start));

            argSlot = new XExpChildSlot(3, Number.MAX_SAFE_INTEGER);
            exp.pushChild(argSlot);

            expected.exp = exp;
        }
        expected.pushError(new ErrorUnterminatedExpression(callerToken));

        assert.deepStrictEqual(result, expected);
    });

    test("f(,g(a, b),c)", () => {
        const callerTokenF: XToken = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerTokenF: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 1);
        const openerTokenG: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 4);
        const closerTokenG: XToken = TestUtils.createXToken(XSyntaxToken.PClose, 9);
        const closerTokenF: XToken = TestUtils.createXToken(XSyntaxToken.PClose, 12);
        const argSep1: XToken = TestUtils.createXToken(XSyntaxToken.ArgSep, 2);
        const argSep2: XToken = TestUtils.createXToken(XSyntaxToken.ArgSep, 6);
        const argSep3: XToken = TestUtils.createXToken(XSyntaxToken.ArgSep, 10);
        const callerTokenG: XToken = TestUtils.createXToken("g", 3, TokenType.Word);
        const arg1: XToken = TestUtils.createXToken("a", 5, TokenType.Word);
        const arg2: XToken = TestUtils.createXToken("b", 8, TokenType.Word);
        const arg3: XToken = TestUtils.createXToken("c", 11, TokenType.Word);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerTokenF,
                new TokenGroup(
                    [
                        argSep1,
                        callerTokenG,
                        new TokenGroup(
                            [
                                arg1,
                                argSep2,
                                arg2
                            ],
                            openerTokenG,
                            closerTokenG
                        ),
                        argSep3,
                        arg3
                    ],
                    openerTokenF,
                    closerTokenF,
                )
            ]
        );
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        {
            const exp: XExp = new XExp(callerTokenF, openerTokenF, closerTokenF);
            let argSlot: XExpChildSlot;

            argSlot = new XExpChildSlot(2, 2);
            exp.pushChild(argSlot);

            exp.pushChild(new XExpChildSep(argSep1.val as Operator, argSep1.start));

            argSlot = new XExpChildSlot(3, 10);
            {
                const exp2: XExp = new XExp(callerTokenG, openerTokenG, closerTokenG);
                let argSlot2: XExpChildSlot;

                argSlot2 = new XExpChildSlot(5, 6);
                exp2.pushChild(argSlot2);
                argSlot2.pushToSlot(arg1);

                exp2.pushChild(new XExpChildSep(argSep2.val as Operator, argSep2.start));

                argSlot2 = new XExpChildSlot(7, 9);
                exp2.pushChild(argSlot2);
                argSlot2.pushToSlot(arg2);

                argSlot.pushToSlot(exp2);
            }
            exp.pushChild(argSlot);

            exp.pushChild(new XExpChildSep(argSep3.val as Operator, argSep3.start));

            argSlot = new XExpChildSlot(11, 12);
            argSlot.pushToSlot(arg3);
            exp.pushChild(argSlot);

            expected.exp = exp;
        }

        assert.deepStrictEqual(result, expected);
    });

    test("f(x) y z", () => {
        const callerToken: XToken = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 1);
        const closerToken: XToken = TestUtils.createXToken(XSyntaxToken.PClose, 3);
        const x: XToken = TestUtils.createXToken("x", 2, TokenType.Word);
        const y: XToken = TestUtils.createXToken("y", 5, TokenType.Word);
        const z: XToken = TestUtils.createXToken("z", 7, TokenType.Word);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup(
                    [x],
                    openerToken,
                    closerToken,
                ),
                y,
                z,
            ]
        );
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        {
            const exp: XExp = new XExp(callerToken, openerToken, closerToken);
            let argSlot: XExpChildSlot;

            argSlot = new XExpChildSlot(2, 3);
            argSlot.pushToSlot(x);
            exp.pushChild(argSlot);

            expected.exp = exp;
        }
        expected.pushError(new ErrorInvalidStatement(y));
        expected.pushError(new ErrorInvalidStatement(z));

        assert.deepStrictEqual(result, expected);
    });

    test("(", () => {
        const openerToken: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 0);
        const tknGroup = new TokenGroup([], openerToken);

        const st: PreparsedStatement = new PreparsedStatement([tknGroup]);
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        expected.pushError(new ErrorInvalidStatement(tknGroup));

        assert.deepStrictEqual(result, expected);
    });

    test("f(g(", () => {
        const callerTokenF: XToken = TestUtils.createXToken("f", 0, TokenType.Word);
        const callerTokenG: XToken = TestUtils.createXToken("g", 2, TokenType.Word);
        const openerToken1: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 1);
        const openerToken2: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 3);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerTokenF,
                new TokenGroup(
                    [callerTokenG, new TokenGroup([], openerToken2)],
                    openerToken1,
                )
            ]
        );
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        {
            const exp: XExp = new XExp(callerTokenF, openerToken1);
            let argSlot: XExpChildSlot;

            argSlot = new XExpChildSlot(2);
            exp.pushChild(argSlot);

            const exp2 = new XExp(callerTokenG, openerToken2);
            exp2.pushChild(new XExpChildSlot(4));
            argSlot.pushToSlot(exp2);

            expected.exp = exp;
        }
        expected.pushError(new ErrorUnterminatedExpression(callerTokenG));
        expected.pushError(new ErrorUnterminatedExpression(callerTokenF));

        assert.deepStrictEqual(result, expected);
    });

    test("f((", () => {
        const callerToken: XToken = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken1: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 1);
        const openerToken2: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 2);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup(
                    [new TokenGroup([], openerToken2)],
                    openerToken1,
                )
            ],
        );
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        {
            const exp: XExp = new XExp(callerToken, openerToken1);
            const argSlot: XExpChildSlot = new XExpChildSlot(2);
            const exp2 = new XExp(openerToken2, openerToken2);
            exp2.pushChild(new XExpChildSlot(3));
            argSlot.pushToSlot(exp2);
            exp.pushChild(argSlot);
            expected.exp = exp;
        }
        expected.pushError(new ErrorUnterminatedExpression(openerToken2));
        expected.pushError(new ErrorUnexpectedOpeningToken(openerToken2));
        expected.pushError(new ErrorUnterminatedExpression(callerToken));

        assert.deepStrictEqual(result, expected);
    });

    test("f(", () => {
        const callerToken: XToken = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 1);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup([], openerToken)
            ],
        );
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        {
            const exp: XExp = new XExp(callerToken, openerToken);
            const argSlot: XExpChildSlot = new XExpChildSlot(2);
            exp.pushChild(argSlot);
            expected.exp = exp;
        }
        expected.pushError(new ErrorUnterminatedExpression(callerToken));

        assert.deepStrictEqual(result, expected);
    });

    test("f)", () => {
        const callerToken: XToken = TestUtils.createXToken("f", 0, TokenType.Word);
        const closerToken: XToken = TestUtils.createXToken(XSyntaxToken.PClose, 1);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                closerToken
            ],
        );
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        expected.pushError(new ErrorInvalidStatement(closerToken));

        assert.deepStrictEqual(result, expected);
    });

    test("f( four ) sup", () => {
        const callerToken: XToken = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: XToken = TestUtils.createXToken(XSyntaxToken.POpen, 1);
        const closerToken: XToken = TestUtils.createXToken(XSyntaxToken.PClose, 8);
        const arg: XToken = TestUtils.createXToken("four", 3, TokenType.String);
        const last: XToken = TestUtils.createXToken("sup", 10, TokenType.Word);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup(
                    [arg],
                    openerToken,
                    closerToken,
                ),
                last
            ],
        );
        const result: XParsedLine = XParser.parse(st);
        const expected: XParsedLine = new XParsedLine;
        {
            const exp: XExp = new XExp(callerToken, openerToken, closerToken);
            const argSlot: XExpChildSlot = new XExpChildSlot(2, 8);
            argSlot.pushToSlot(arg);
            exp.pushChild(argSlot);
            expected.exp = exp;
        }
        expected.pushError(new ErrorInvalidStatement(last));

        assert.deepStrictEqual(result, expected);
    });
});