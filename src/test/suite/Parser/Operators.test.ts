import * as assert from "assert";
import { ErrMsg } from "../../../model/ErrMsg";
import { Statement } from "../../../model/Statement";
import { Token } from "../../../model/Token";
import { TokenType } from "../../../model/TokenType";
import { Parser } from "../../../Parser";
import { SyntaxToken } from "../../../Tokenizer";
import { createToken } from "../TestUtils";

suite("Suite for Parser: operators", () => {
    test("parsing comparison exp", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "12", TokenType.Word),
            createToken(6, "!=", TokenType.Operator),
            createToken(8, "1", TokenType.Word),
            createToken(9, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [
                            {
                                args: [],
                                start: 4,
                                end: 6,
                                bgnPos: 4,
                                endPos: 6,
                                value: "12"
                            },
                            {
                                args: [],
                                start: 8,
                                end: 9,
                                bgnPos: 8,
                                endPos: 9,
                                value: "1"
                            },
                        ],
                        start: 4,
                        end: 9,
                        bgnPos: 4,
                        endPos: 9,
                        value: "!="
                    }
                ],
                start: 0,
                end: 10,
                bgnPos: 4,
                endPos: 9,
                opens: SyntaxToken.POpen,
                value: "fun",
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("parsing more complex comparison exp, with extra whitespace", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "blue", TokenType.Word),
            createToken(8, ","),
            createToken(100, "12", TokenType.Word),
            createToken(110, ">=", TokenType.Operator),
            createToken(120, "1", TokenType.Word),
            createToken(130, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        start: 4,
                        end: 8,
                        bgnPos: 4,
                        endPos: 8,
                        value: "blue",
                        args: [],
                    },
                    {
                        args: [
                            {
                                args: [],
                                start: 100,
                                end: 102,
                                bgnPos: 100,
                                endPos: 102,
                                value: "12"
                            },
                            {
                                args: [],
                                start: 120,
                                end: 121,
                                bgnPos: 120,
                                endPos: 121,
                                value: "1"
                            },
                        ],
                        start: 100,
                        end: 121,
                        bgnPos: 9,
                        endPos: 130,
                        value: ">="
                    }
                ],
                start: 0,
                end: 131,
                bgnPos: 4,
                endPos: 130,
                opens: SyntaxToken.POpen,
                value: "fun",
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("parsing comparison exp that only contains operator", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(6, "!=", TokenType.Operator),
            createToken(15, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [],
                        start: 6,
                        end: 8,
                        bgnPos: 4,
                        endPos: 15,
                        value: "",
                        parseErrors: [{
                            msg: ErrMsg.ParseOperatorForm
                        }]
                    }
                ],
                start: 0,
                end: 16,
                bgnPos: 4,
                endPos: 15,
                opens: SyntaxToken.POpen,
                value: "fun",
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("parsing unknown operator exp", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "12", TokenType.Word),
            createToken(6, "=", TokenType.OperatorIncomplete),
            createToken(7, "9", TokenType.Word),
            createToken(8, ","),
            createToken(10, "blue", TokenType.Word),
            createToken(15, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [],
                        start: 6,
                        end: 7,
                        bgnPos: 4,
                        endPos: 8,
                        value: "",
                        parseErrors: [{
                            msg: ErrMsg.ParseUnknownOperator
                        }]
                    },
                    {
                        start: 10,
                        end: 14,
                        bgnPos: 9,
                        endPos: 15,
                        value: "blue",
                        args: [],
                    }
                ],
                start: 0,
                end: 16,
                bgnPos: 4,
                endPos: 15,
                opens: SyntaxToken.POpen,
                value: "fun",
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("comparison with nested func exp", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "red", TokenType.Word),
            createToken(7, ">", TokenType.Operator),
            createToken(8, "g", TokenType.Word),
            createToken(9, "("),
            createToken(10, "x", TokenType.Word),
            createToken(11, ")"),
            createToken(12, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [
                            {
                                args: [],
                                start: 4,
                                end: 7,
                                bgnPos: 4,
                                endPos: 7,
                                value: "red"
                            },
                            {
                                args: [{
                                    args: [],
                                    start: 10,
                                    end: 11,
                                    bgnPos: 10,
                                    endPos: 11,
                                    value: "x"
                                }],
                                start: 8,
                                end: 12,
                                bgnPos: 10,
                                endPos: 11,
                                opens: SyntaxToken.POpen,
                                value: "g"
                            }
                        ],
                        start: 4,
                        end: 12,
                        bgnPos: 4,
                        endPos: 12,
                        value: ">"
                    }
                ],
                start: 0,
                end: 13,
                bgnPos: 4,
                endPos: 12,
                opens: SyntaxToken.POpen,
                value: "fun"
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("parsing unfinished comparison exp", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "12", TokenType.Word),
            createToken(6, "!=", TokenType.Operator),
            createToken(8, ","),
            createToken(10, "blue", TokenType.Word),
            createToken(15, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [],
                        start: 4,
                        end: 8,
                        bgnPos: 4,
                        endPos: 8,
                        value: "",
                        parseErrors: [{
                            msg: ErrMsg.ParseOperatorForm
                        }]
                    },
                    {
                        start: 10,
                        end: 14,
                        bgnPos: 9,
                        endPos: 15,
                        value: "blue",
                        args: [],
                    }
                ],
                start: 0,
                end: 16,
                bgnPos: 4,
                endPos: 15,
                opens: SyntaxToken.POpen,
                value: "fun",
            }
        };
        assert.deepStrictEqual(res, expected);
    });

});