import * as assert from "assert";
import { ErrMsg } from "../../../model/ErrMsg";
import { Statement } from "../../../model/Statement";
import { Token } from "../../../model/Token";
import { TokenType } from "../../../model/TokenType";
import { Parser } from "../../../Parser";
import { SyntaxToken } from "../../../Tokenizer";
import { createToken } from "../TestUtils";

suite("Suite for Parser: unterminated exps", () => {
    test("empty exp", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        start: 3,
                        end: 4,
                        value: "",
                        args: [],
                        bgnPos: 4,
                        endPos: Number.MAX_SAFE_INTEGER,
                        parseErrors: [
                            {
                                msg: ErrMsg.ParseEmptyParam
                            },
                        ]
                    }
                ],
                start: 0,
                end: Number.MAX_SAFE_INTEGER,
                bgnPos: 4,
                endPos: Number.MAX_SAFE_INTEGER,
                value: "fun",
                opens: SyntaxToken.POpen,
                parseErrors: [{
                    msg: ErrMsg.ParseUnterminatedExp
                }]
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("exp call ended by word", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "red", TokenType.Word)
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [{
                    args: [],
                    start: 4,
                    end: 7,
                    value: "red",
                    bgnPos: 4,
                    endPos: Number.MAX_SAFE_INTEGER,
                }],
                start: 0,
                end: Number.MAX_SAFE_INTEGER,
                value: "fun",
                bgnPos: 4,
                endPos: Number.MAX_SAFE_INTEGER,
                opens: SyntaxToken.POpen,
                parseErrors: [{
                    msg: ErrMsg.ParseUnterminatedExp
                }]
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("exp with comma", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, ","),
            createToken(5, "red", TokenType.Word)
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
                        end: 8,
                        value: "red",
                        bgnPos: 5,
                        endPos: Number.MAX_SAFE_INTEGER,
                    }
                ],
                start: 0,
                end: Number.MAX_SAFE_INTEGER,
                value: "fun",
                bgnPos: 4,
                opens: SyntaxToken.POpen,
                endPos: Number.MAX_SAFE_INTEGER,
                parseErrors: [{
                    msg: ErrMsg.ParseUnterminatedExp
                }]
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("exp ended by comma", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, ","),
            createToken(5, "red", TokenType.Word),
            createToken(100, ","),
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
                        end: 8,
                        value: "red",
                        bgnPos: 5,
                        endPos: 100,
                    },
                    {
                        args: [],
                        start: 100,
                        end: 101,
                        value: "",
                        bgnPos: 101,
                        endPos: Number.MAX_SAFE_INTEGER,
                        parseErrors: [
                            {
                                msg: ErrMsg.ParseEmptyParam
                            },
                        ]
                    },
                ],
                start: 0,
                bgnPos: 4,
                endPos: Number.MAX_SAFE_INTEGER,
                end: Number.MAX_SAFE_INTEGER,
                value: "fun",
                opens: SyntaxToken.POpen,
                parseErrors: [{
                    msg: ErrMsg.ParseUnterminatedExp
                }]
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("exp ended by operator", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, ","),
            createToken(5, "red", TokenType.Word),
            createToken(8, "<", TokenType.Operator),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [],
                        start: 4,
                        end: 5,
                        bgnPos: 4,
                        endPos: 4,
                        value: "",
                        parseErrors: [{
                            msg: ErrMsg.ParseEmptyParam
                        }]
                    },
                    {
                        args: [],
                        start: 5,
                        end: 9,
                        bgnPos: 5,
                        endPos: Number.MAX_SAFE_INTEGER,
                        value: "",
                        parseErrors: [{
                            msg: ErrMsg.ParseOperatorForm
                        }]
                    }
                ],
                start: 0,
                end: Number.MAX_SAFE_INTEGER,
                value: "fun",
                bgnPos: 4,
                endPos: Number.MAX_SAFE_INTEGER,
                opens: SyntaxToken.POpen,
                parseErrors: [{
                    msg: ErrMsg.ParseUnterminatedExp
                }]
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("nested exp", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "red", TokenType.Word),
            createToken(7, ","),
            createToken(8, "g", TokenType.Word),
            createToken(9, "("),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [],
                        start: 4,
                        end: 7,
                        value: "red",
                        bgnPos: 4,
                        endPos: 7,
                    },
                    {
                        args: [{
                            start: 9,
                            end: 10,
                            value: "",
                            args: [],
                            bgnPos: 10,
                            endPos: Number.MAX_SAFE_INTEGER,
                            parseErrors: [
                                {
                                    msg: ErrMsg.ParseEmptyParam
                                },
                            ]
                        }],
                        start: 8,
                        end: Number.MAX_SAFE_INTEGER,
                        bgnPos: 8,
                        endPos: Number.MAX_SAFE_INTEGER,
                        value: "g",
                        opens: SyntaxToken.POpen,
                        parseErrors: [{
                            msg: ErrMsg.ParseUnterminatedExp
                        }]
                    }
                ],
                start: 0,
                end: Number.MAX_SAFE_INTEGER,
                bgnPos: 4,
                endPos: Number.MAX_SAFE_INTEGER,
                value: "fun",
                opens: SyntaxToken.POpen,
                parseErrors: [{
                    msg: ErrMsg.ParseUnterminatedExp
                }]
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("nested exp ended by comma", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "red", TokenType.Word),
            createToken(7, ","),
            createToken(8, "g", TokenType.Word),
            createToken(9, "("),
            createToken(10, ","),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
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
                        args: [
                            {
                                args: [],
                                start: 10,
                                end: 11,
                                value: "",
                                bgnPos: 10,
                                endPos: 10,
                                parseErrors: [{
                                    msg: ErrMsg.ParseEmptyParam
                                }]
                            },
                            {
                                args: [],
                                start: 10,
                                end: 11,
                                bgnPos: 11,
                                endPos: Number.MAX_SAFE_INTEGER,
                                value: "",
                                parseErrors: [{
                                    msg: ErrMsg.ParseEmptyParam
                                }]
                            },
                        ],
                        start: 8,
                        end: Number.MAX_SAFE_INTEGER,
                        bgnPos: 8,
                        endPos: Number.MAX_SAFE_INTEGER,
                        value: "g",
                        opens: SyntaxToken.POpen,
                        parseErrors: [{
                            msg: ErrMsg.ParseUnterminatedExp
                        }]
                    }
                ],
                start: 0,
                end: Number.MAX_SAFE_INTEGER,
                bgnPos: 4,
                endPos: Number.MAX_SAFE_INTEGER,
                value: "fun",
                opens: SyntaxToken.POpen,
                parseErrors: [{
                    msg: ErrMsg.ParseUnterminatedExp
                }]
            }
        };
        assert.deepStrictEqual(res, expected);
    });
});