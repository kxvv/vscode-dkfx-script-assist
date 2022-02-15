import * as assert from "assert";
import { ErrMsg } from "../../../model/ErrMsg";
import { Statement } from "../../../model/Statement";
import { Token } from "../../../model/Token";
import { TokenType } from "../../../model/TokenType";
import { Parser } from "../../../Parser";
import { SyntaxToken } from "../../../Tokenizer";
import { createToken } from "../TestUtils";

suite("Suite for Parser: simple", () => {
    test("simple tokens parsing with string", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, `"eh, f()"`, TokenType.Word),
            createToken(13, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [],
                        start: 4,
                        end: 13,
                        value: `"eh, f()"`,
                        bgnPos: 4,
                        endPos: 13,
                    }
                ],
                start: 0,
                end: 14,
                opens: SyntaxToken.POpen,
                value: "fun",
                bgnPos: 4,
                endPos: 13,
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("simple tokens parsing", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "12", TokenType.Word),
            createToken(6, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [],
                        start: 4,
                        end: 6,
                        value: "12",
                        bgnPos: 4,
                        endPos: 6,
                    }
                ],
                start: 0,
                end: 7,
                bgnPos: 4,
                endPos: 6,
                opens: SyntaxToken.POpen,
                value: "fun",
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("tokens parsing extra space", () => {
        const t: Token[] = [
            createToken(0, "fn", TokenType.Word),
            createToken(2, "("),
            createToken(6, "w", TokenType.Word),
            createToken(8, ","),
            createToken(10, "12", TokenType.Word),
            createToken(14, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [],
                        start: 6,
                        end: 7,
                        value: "w",
                        bgnPos: 3,
                        endPos: 8,
                    },
                    {
                        args: [],
                        start: 10,
                        end: 12,
                        value: "12",
                        bgnPos: 9,
                        endPos: 14,
                    }
                ],
                start: 0,
                end: 15,
                value: "fn",
                opens: SyntaxToken.POpen,
                bgnPos: 3,
                endPos: 14
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("statement with cmd not using args", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word)
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [],
                start: 0,
                end: 3,
                value: "fun",
                bgnPos: 3,
                endPos: 3,
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("parsing nested exps", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "12", TokenType.Word),
            createToken(6, ","),
            createToken(7, "g", TokenType.Word),
            createToken(8, "(",),
            createToken(9, "1", TokenType.Word),
            createToken(10, ")"),
            createToken(11, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [],
                        start: 4,
                        end: 6,
                        value: "12",
                        bgnPos: 4,
                        endPos: 6,
                    },
                    {
                        start: 7,
                        end: 11,
                        value: "g",
                        opens: SyntaxToken.POpen,
                        bgnPos: 7,
                        endPos: 11,
                        args: [
                            {
                                start: 9,
                                end: 10,
                                value: "1",
                                args: [],
                                bgnPos: 9,
                                endPos: 10,
                            }
                        ]
                    }
                ],
                start: 0,
                end: 12,
                value: "fun",
                opens: SyntaxToken.POpen,
                bgnPos: 4,
                endPos: 11,
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("statement + trailing tokens + comment", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "1", TokenType.Word),
            createToken(5, ")"),
            createToken(6, "gun", TokenType.Word),
            createToken(55, "hun", TokenType.Word),
            createToken(100, "rem cmt cmt", TokenType.Comment)
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [{
                    args: [],
                    start: 4,
                    end: 5,
                    bgnPos: 4,
                    endPos: 5,
                    value: "1",
                }],
                start: 0,
                end: 6,
                bgnPos: 4,
                endPos: 5,
                opens: SyntaxToken.POpen,
                value: "fun",
                parseErrors: [{
                    msg: ErrMsg.ParseBadStatement,
                    start: 6,
                    end: 58,
                }]
            },
            comment: "rem cmt cmt"
        };
        assert.deepStrictEqual(res, expected);
    });

    test("exp with empty params", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, ","),
            createToken(5, ","),
            createToken(6, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [],
                        start: 4,
                        end: 5,
                        value: "",
                        bgnPos: 4,
                        endPos: 4,
                        parseErrors: [{
                            msg: ErrMsg.ParseEmptyParam
                        }]
                    },
                    {
                        args: [],
                        start: 5,
                        end: 6,
                        bgnPos: 5,
                        endPos: 5,
                        value: "",
                        parseErrors: [{
                            msg: ErrMsg.ParseEmptyParam
                        }]
                    },
                    {
                        args: [],
                        start: 6,
                        end: 7,
                        bgnPos: 6,
                        endPos: 6,
                        value: "",
                        parseErrors: [{
                            msg: ErrMsg.ParseEmptyParam
                        }]
                    }
                ],
                start: 0,
                end: 7,
                bgnPos: 4,
                endPos: 6,
                opens: SyntaxToken.POpen,
                value: "fun"
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("statement with cmd not using args + comment", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(6, "rem cmt cmt", TokenType.Comment)
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [],
                start: 0,
                end: 3,
                bgnPos: 3,
                endPos: 3,
                value: "fun",
            },
            comment: "rem cmt cmt"
        };
        assert.deepStrictEqual(res, expected);
    });

    test("open/close tokens mismatch", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(6, "1", TokenType.Word),
            createToken(7, "]"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [],
                        bgnPos: 4,
                        endPos: 7,
                        start: 6,
                        end: 7,
                        value: "1"
                    }
                ],
                start: 0,
                end: 8,
                bgnPos: 4,
                endPos: 7,
                opens: SyntaxToken.POpen,
                value: "fun",
                parseErrors: [{
                    start: 7,
                    end: 8,
                    msg: ErrMsg.ParseParensMismatch
                }]
            }
        };
        assert.deepStrictEqual(res, expected);
    });
});