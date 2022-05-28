import * as assert from "assert";
import { TokenGroup } from "../../interpreter/model/TokenGroup";
import { ErrorInvalidStatement, ErrorUnexpectedOpeningToken, ErrorUnterminatedExpression } from "../../interpreter/model/XError";
import { XSyntaxToken, XToken } from "../../interpreter/model/XToken";
import { PreparsedStatement } from "../../interpreter/Preparser";
import { Operator } from "../../model/Operators";
import { TokenType } from "../../model/TokenType";
import { TestUtils } from "./TestUtils";
import { XParser2 } from "../../interpreter/XParser2";
import { XExp2 } from "../../interpreter/model/XExp2";
import { XParsedLine2 } from "../../interpreter/model/XParsedLine";
import { XExpChild } from "../../interpreter/model/XExpChild";
import { XConst2 } from "../../interpreter/model/XConst2";

suite("Suite for XParser2::" + XParser2.parse.name, () => {
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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
        {
            const exp: XExp2 = new XExp2(callerToken, openerToken, closerToken);
            exp.getChildren().pop();
            const children = exp.getChildren();
            let child: XExpChild;

            child = new XExpChild(exp, 2, 8);
            child.val = new XConst2(child, arg.val, arg.start);

            children.push(child);
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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
        {
            const exp: XExp2 = new XExp2(callerToken, openerToken, closerToken);
            exp.getChildren().pop();
            let child: XExpChild;

            child = new XExpChild(exp, 2, 6);
            child.val = new XConst2(child, arg1.val, arg1.start);
            exp.getChildren().push(child);
            child = new XExpChild(exp, 6, 9);
            child.val = new XConst2(child, argSep.val, argSep.start);
            exp.getChildren().push(child);
            child = new XExpChild(exp, 9, 14);
            child.val = new XConst2(child, arg2.val, arg2.start);
            exp.getChildren().push(child);
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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
        {
            const exp: XExp2 = new XExp2(callerToken, openerToken, closerToken);
            exp.getChildren().pop();
            let child: XExpChild;
            child = new XExpChild(exp, 2, 4);
            exp.getChildren().push(child);
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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
        {
            const exp: XExp2 = new XExp2(callerToken, openerToken, closerToken);
            exp.getChildren().pop();
            let child: XExpChild;

            child = new XExpChild(exp, 2, 2);
            exp.getChildren().push(child);
            child = new XExpChild(exp, 3, 3);
            child.preSep = argSep1;
            exp.getChildren().push(child);
            child = new XExpChild(exp, 4, 9);
            child.val = new XConst2(child, arg.val, arg.start);
            child.preSep = argSep2;
            exp.getChildren().push(child);
            child = new XExpChild(exp, 10, 10);
            child.preSep = argSep3;
            exp.getChildren().push(child);

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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
        {
            const exp: XExp2 = new XExp2(callerToken, openerToken);
            exp.getChildren().pop();
            let child: XExpChild;

            child = new XExpChild(exp, 2, 2);
            exp.getChildren().push(child);
            child = new XExpChild(exp, 3);
            child.preSep = argSep;
            exp.getChildren().push(child);

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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
        {
            const exp: XExp2 = new XExp2(callerTokenF, openerTokenF, closerTokenF);
            exp.getChildren().pop();
            let child: XExpChild;

            child = new XExpChild(exp, 2, 2);
            exp.getChildren().push(child);

            child = new XExpChild(exp, 3, 10);
            {
                const exp2: XExp2 = new XExp2(callerTokenG, openerTokenG, closerTokenG);
                exp2.parent = child;
                exp2.getChildren().pop();
                let childG: XExpChild = new XExpChild(exp2, 5, 6);
                childG.val = new XConst2(childG, arg1.val, arg1.start);
                exp2.getChildren().push(childG);

                childG = new XExpChild(exp2, 7, 9);
                childG.preSep = argSep2;
                childG.val = new XConst2(childG, arg2.val, arg2.start);
                exp2.getChildren().push(childG);
                child.val = exp2;
            }
            child.preSep = argSep1;
            exp.getChildren().push(child);

            child = new XExpChild(exp, 11, 12);
            child.val = new XConst2(child, arg3.val, arg3.start);
            child.preSep = argSep3;
            exp.getChildren().push(child);

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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
        {
            const exp: XExp2 = new XExp2(callerToken, openerToken, closerToken);
            exp.getChildren().pop();
            let child: XExpChild = new XExpChild(exp, 2, 3);
            child.val = new XConst2(child, x.val, x.start);
            exp.getChildren().push(child);
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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
        {
            const exp: XExp2 = new XExp2(callerTokenF, openerToken1);
            exp.getChildren().pop();
            let child: XExpChild;
            child = new XExpChild(exp, 2);
            {
                const exp2: XExp2 = new XExp2(callerTokenG, openerToken2);
                exp2.getChildren().pop();
                exp2.getChildren().push(new XExpChild(exp2, 4));
                child.val = exp2;
                exp2.parent = child;
            }
            exp.getChildren().push(child);
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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
        {
            const exp: XExp2 = new XExp2(callerToken, openerToken1);
            exp.getChildren().pop();
            const child: XExpChild = new XExpChild(exp, 2);
            {
                const exp2 = new XExp2(openerToken2, openerToken2);
                exp2.getChildren().pop();
                exp2.getChildren().push(new XExpChild(exp2, 3));
                exp2.parent = child;
                child.val = exp2;
            }
            exp.getChildren().push(child);
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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
        {
            const exp: XExp2 = new XExp2(callerToken, openerToken);
            exp.getChildren().pop();
            const child: XExpChild = new XExpChild(exp, 2);
            exp.getChildren().push(child);
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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
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
        const result: XParsedLine2 = XParser2.parse(st);
        const expected: XParsedLine2 = new XParsedLine2;
        {
            const exp: XExp2 = new XExp2(callerToken, openerToken, closerToken);
            exp.getChildren().pop();
            const child: XExpChild = new XExpChild(exp, 2, 8);
            child.val = new XConst2(child, arg.val, arg.start);
            exp.getChildren().push(child);
            expected.exp = exp;
        }
        expected.pushError(new ErrorInvalidStatement(last));

        assert.deepStrictEqual(result, expected);
    });
});