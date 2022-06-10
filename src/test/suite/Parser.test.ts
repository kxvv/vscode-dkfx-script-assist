import * as assert from "assert";
import { ErrorInvalidStatement, ErrorUnexpectedOpeningToken, ErrorUnterminatedExpression } from "../../interpreter/model/DKError";
import { Exp, RangeExp } from "../../interpreter/model/Exp";
import { ExpChild } from "../../interpreter/model/ExpChild";
import { ParsedLine } from "../../interpreter/model/ParsedLine";
import { Token, SyntaxToken } from "../../interpreter/model/Token";
import { TokenGroup } from "../../interpreter/model/TokenGroup";
import { Word } from "../../interpreter/model/Word";
import { Parser } from "../../interpreter/Parser";
import { PreparsedStatement } from "../../interpreter/Preparser";
import { Operator } from "../../model/Operators";
import { TokenType } from "../../model/TokenType";
import { TestUtils } from "./TestUtils";

suite("Suite for Parser::" + Parser.parse.name, () => {
    test("f( four ) rem hi", () => {
        const callerToken: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);
        const closerToken: Token = TestUtils.createXToken(SyntaxToken.PClose, 8);
        const arg: Token = TestUtils.createXToken("four", 3, TokenType.String);
        const comment: Token = TestUtils.createXToken("rem hi", 10, TokenType.Comment);

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
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerToken, openerToken, closerToken);
            exp.getChildren().pop();
            const children = exp.getChildren();
            let child: ExpChild;

            child = new ExpChild(exp, 2, 8);
            child.val = new Word(child, arg.val, arg.start);

            children.push(child);
            expected.exp = exp;
            expected.comment = comment;
        }
        assert.deepStrictEqual(result, expected);
    });

    test("f(four  > f0ur)", () => {
        const callerToken: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);
        const closerToken: Token = TestUtils.createXToken(SyntaxToken.PClose, 14);
        const arg1: Token = TestUtils.createXToken("four", 2, TokenType.String);
        const argSep: Token = TestUtils.createXToken(Operator.Gt, 8, TokenType.Operator);
        const arg2: Token = TestUtils.createXToken("f0ur", 10, TokenType.String);

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
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerToken, openerToken, closerToken);
            exp.getChildren().pop();
            let child: ExpChild;

            child = new ExpChild(exp, 2, 6);
            child.val = new Word(child, arg1.val, arg1.start);
            exp.getChildren().push(child);
            child = new ExpChild(exp, 6, 9);
            child.val = new Word(child, argSep.val, argSep.start);
            exp.getChildren().push(child);
            child = new ExpChild(exp, 9, 14);
            child.val = new Word(child, arg2.val, arg2.start);
            exp.getChildren().push(child);
            expected.exp = exp;
        }

        assert.deepStrictEqual(result, expected);
    });

    test("f(four>", () => {
        const callerToken: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);
        const arg1: Token = TestUtils.createXToken("four", 2, TokenType.String);
        const argSep: Token = TestUtils.createXToken(Operator.Gt, 6, TokenType.Operator);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup(
                    [arg1, argSep],
                    openerToken,
                )
            ]
        );
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerToken, openerToken);
            exp.getChildren().pop();
            let child: ExpChild;

            child = new ExpChild(exp, 2, 6);
            child.val = new Word(child, arg1.val, arg1.start);
            exp.getChildren().push(child);
            child = new ExpChild(exp, 6, 7);
            child.val = new Word(child, argSep.val, argSep.start);
            exp.getChildren().push(child);
            child = new ExpChild(exp, 7, Number.MAX_SAFE_INTEGER);
            exp.getChildren().push(child);
            expected.exp = exp;
        }
        expected.parseErrs = [new ErrorUnterminatedExpression(callerToken)];

        assert.deepStrictEqual(result, expected);
    });

    test("f(  )", () => {
        const callerToken: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);
        const closerToken: Token = TestUtils.createXToken(SyntaxToken.PClose, 4);

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
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerToken, openerToken, closerToken);
            exp.getChildren().pop();
            let child: ExpChild;
            child = new ExpChild(exp, 2, 4);
            exp.getChildren().push(child);
            expected.exp = exp;
        }
        assert.deepStrictEqual(result, expected);
    });

    test("f(,, argg,)", () => {
        const callerToken: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);
        const closerToken: Token = TestUtils.createXToken(SyntaxToken.PClose, 10);
        const argSep1: Token = TestUtils.createXToken(SyntaxToken.ArgSep, 2);
        const argSep2: Token = TestUtils.createXToken(SyntaxToken.ArgSep, 3);
        const arg: Token = TestUtils.createXToken("argg", 5, TokenType.String);
        const argSep3: Token = TestUtils.createXToken(SyntaxToken.ArgSep, 9);

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
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerToken, openerToken, closerToken);
            exp.getChildren().pop();
            let child: ExpChild;

            child = new ExpChild(exp, 2, 2);
            exp.getChildren().push(child);
            child = new ExpChild(exp, 3, 3);
            child.preSep = argSep1;
            exp.getChildren().push(child);
            child = new ExpChild(exp, 4, 9);
            child.val = new Word(child, arg.val, arg.start);
            child.preSep = argSep2;
            exp.getChildren().push(child);
            child = new ExpChild(exp, 10, 10);
            child.preSep = argSep3;
            exp.getChildren().push(child);

            expected.exp = exp;
        }

        assert.deepStrictEqual(result, expected);
    });

    test("f(, ", () => {
        const callerToken: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);
        const argSep: Token = TestUtils.createXToken(SyntaxToken.ArgSep, 2);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup(
                    [argSep],
                    openerToken,
                )
            ]
        );
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerToken, openerToken);
            exp.getChildren().pop();
            let child: ExpChild;

            child = new ExpChild(exp, 2, 2);
            exp.getChildren().push(child);
            child = new ExpChild(exp, 3);
            child.preSep = argSep;
            exp.getChildren().push(child);

            expected.exp = exp;
        }
        expected.pushError(new ErrorUnterminatedExpression(callerToken));

        assert.deepStrictEqual(result, expected);
    });

    test("f(,g(a, b),c)", () => {
        const callerTokenF: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerTokenF: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);
        const openerTokenG: Token = TestUtils.createXToken(SyntaxToken.POpen, 4);
        const closerTokenG: Token = TestUtils.createXToken(SyntaxToken.PClose, 9);
        const closerTokenF: Token = TestUtils.createXToken(SyntaxToken.PClose, 12);
        const argSep1: Token = TestUtils.createXToken(SyntaxToken.ArgSep, 2);
        const argSep2: Token = TestUtils.createXToken(SyntaxToken.ArgSep, 6);
        const argSep3: Token = TestUtils.createXToken(SyntaxToken.ArgSep, 10);
        const callerTokenG: Token = TestUtils.createXToken("g", 3, TokenType.Word);
        const arg1: Token = TestUtils.createXToken("a", 5, TokenType.Word);
        const arg2: Token = TestUtils.createXToken("b", 8, TokenType.Word);
        const arg3: Token = TestUtils.createXToken("c", 11, TokenType.Word);

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
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerTokenF, openerTokenF, closerTokenF);
            exp.getChildren().pop();
            let child: ExpChild;

            child = new ExpChild(exp, 2, 2);
            exp.getChildren().push(child);

            child = new ExpChild(exp, 3, 10);
            {
                const exp2: Exp = new Exp(callerTokenG, openerTokenG, closerTokenG);
                exp2.parent = child;
                exp2.getChildren().pop();
                let childG: ExpChild = new ExpChild(exp2, 5, 6);
                childG.val = new Word(childG, arg1.val, arg1.start);
                exp2.getChildren().push(childG);

                childG = new ExpChild(exp2, 7, 9);
                childG.preSep = argSep2;
                childG.val = new Word(childG, arg2.val, arg2.start);
                exp2.getChildren().push(childG);
                child.val = exp2;
            }
            child.preSep = argSep1;
            exp.getChildren().push(child);

            child = new ExpChild(exp, 11, 12);
            child.val = new Word(child, arg3.val, arg3.start);
            child.preSep = argSep3;
            exp.getChildren().push(child);

            expected.exp = exp;
        }

        assert.deepStrictEqual(result, expected);
    });

    test("f(x) y z", () => {
        const callerToken: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);
        const closerToken: Token = TestUtils.createXToken(SyntaxToken.PClose, 3);
        const x: Token = TestUtils.createXToken("x", 2, TokenType.Word);
        const y: Token = TestUtils.createXToken("y", 5, TokenType.Word);
        const z: Token = TestUtils.createXToken("z", 7, TokenType.Word);

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
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerToken, openerToken, closerToken);
            exp.getChildren().pop();
            let child: ExpChild = new ExpChild(exp, 2, 3);
            child.val = new Word(child, x.val, x.start);
            exp.getChildren().push(child);
            expected.exp = exp;
        }
        expected.pushError(new ErrorInvalidStatement(y));
        expected.pushError(new ErrorInvalidStatement(z));

        assert.deepStrictEqual(result, expected);
    });

    test("(", () => {
        const openerToken: Token = TestUtils.createXToken(SyntaxToken.POpen, 0);
        const tknGroup = new TokenGroup([], openerToken);

        const st: PreparsedStatement = new PreparsedStatement([tknGroup]);
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        expected.pushError(new ErrorInvalidStatement(tknGroup));

        assert.deepStrictEqual(result, expected);
    });

    test("f(g(", () => {
        const callerTokenF: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const callerTokenG: Token = TestUtils.createXToken("g", 2, TokenType.Word);
        const openerToken1: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);
        const openerToken2: Token = TestUtils.createXToken(SyntaxToken.POpen, 3);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerTokenF,
                new TokenGroup(
                    [callerTokenG, new TokenGroup([], openerToken2)],
                    openerToken1,
                )
            ]
        );
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerTokenF, openerToken1);
            exp.getChildren().pop();
            let child: ExpChild;
            child = new ExpChild(exp, 2);
            {
                const exp2: Exp = new Exp(callerTokenG, openerToken2);
                exp2.getChildren().pop();
                exp2.getChildren().push(new ExpChild(exp2, 4));
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
        const callerToken: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken1: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);
        const openerToken2: Token = TestUtils.createXToken(SyntaxToken.POpen, 2);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup(
                    [new TokenGroup([], openerToken2)],
                    openerToken1,
                )
            ],
        );
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerToken, openerToken1);
            exp.getChildren().pop();
            const child: ExpChild = new ExpChild(exp, 2);
            {
                const exp2 = new Exp(openerToken2, openerToken2);
                exp2.getChildren().pop();
                exp2.getChildren().push(new ExpChild(exp2, 3));
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
        const callerToken: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup([], openerToken)
            ],
        );
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerToken, openerToken);
            exp.getChildren().pop();
            const child: ExpChild = new ExpChild(exp, 2);
            exp.getChildren().push(child);
            expected.exp = exp;
        }
        expected.pushError(new ErrorUnterminatedExpression(callerToken));

        assert.deepStrictEqual(result, expected);
    });

    test("f)", () => {
        const callerToken: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const closerToken: Token = TestUtils.createXToken(SyntaxToken.PClose, 1);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                closerToken
            ],
        );
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        expected.pushError(new ErrorInvalidStatement(closerToken));

        assert.deepStrictEqual(result, expected);
    });

    test("f( four ) sup", () => {
        const callerToken: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);
        const closerToken: Token = TestUtils.createXToken(SyntaxToken.PClose, 8);
        const arg: Token = TestUtils.createXToken("four", 3, TokenType.String);
        const last: Token = TestUtils.createXToken("sup", 10, TokenType.Word);

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
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerToken, openerToken, closerToken);
            exp.getChildren().pop();
            const child: ExpChild = new ExpChild(exp, 2, 8);
            child.val = new Word(child, arg.val, arg.start);
            exp.getChildren().push(child);
            expected.exp = exp;
        }
        expected.pushError(new ErrorInvalidStatement(last));

        assert.deepStrictEqual(result, expected);
    });

    test("f( 12 ~ 22 )", () => {
        const callerToken: Token = TestUtils.createXToken("f", 0, TokenType.Word);
        const openerToken: Token = TestUtils.createXToken(SyntaxToken.POpen, 1);
        const closerToken: Token = TestUtils.createXToken(SyntaxToken.PClose, 11);
        const left: Token = TestUtils.createXToken("12", 3, TokenType.Word);
        const operator: Token = TestUtils.createXToken("~", 6, TokenType.Operator);
        const right: Token = TestUtils.createXToken("22", 8, TokenType.Word);

        const st: PreparsedStatement = new PreparsedStatement(
            [
                callerToken,
                new TokenGroup(
                    [left, operator, right],
                    openerToken,
                    closerToken,
                )
            ],
        );
        const result: ParsedLine = Parser.parse(st);
        const expected: ParsedLine = new ParsedLine;
        {
            const exp: Exp = new Exp(callerToken, openerToken, closerToken);
            exp.getChildren().pop();

            const child = new ExpChild(exp, 2, 11);
            child.val = new RangeExp(left, operator, right);
            child.val.parent = child;

            exp.getChildren().push(child);
            expected.exp = exp;
        }
        assert.deepStrictEqual(result, expected);
    });
});