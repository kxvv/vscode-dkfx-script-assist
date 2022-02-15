import * as assert from "assert";
import { ErrMsg } from "../../../model/ErrMsg";
import { Statement } from "../../../model/Statement";
import { Token } from "../../../model/Token";
import { TokenType } from "../../../model/TokenType";
import { Parser } from "../../../Parser";
import { SyntaxToken } from "../../../Tokenizer";
import { createToken } from "../TestUtils";

suite("Suite for Parser: misc", () => {
    test("parsing exp that has words not separated by comma", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "1", TokenType.Word),
            createToken(5, ","),
            createToken(6, "a", TokenType.Word),
            createToken(10, "b", TokenType.Word),
            createToken(15, ")"),
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
                        endPos: 5,
                        value: "1",
                    },
                    {
                        args: [],
                        start: 10,
                        end: 11,
                        bgnPos: 6,
                        endPos: 15,
                        value: "",
                        parseErrors: [{
                            msg: ErrMsg.ParseExpectedSep
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

    test("parsing unexpected exp opening", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "12", TokenType.Word),
            createToken(6, ","),
            createToken(7, "(",),
            createToken(8, "1", TokenType.Word),
            createToken(9, ")"),
            createToken(10, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
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
                        start: 7,
                        end: 10,
                        bgnPos: 7,
                        endPos: 10,
                        opens: SyntaxToken.POpen,
                        value: "",
                        args: [
                            {
                                start: 8,
                                end: 9,
                                value: "1",
                                args: [],
                                bgnPos: 8,
                                endPos: 9,
                            }
                        ],
                        parseErrors: [
                            {
                                msg: ErrMsg.ParseUnexpectedOpening
                            }
                        ]
                    }
                ],
                start: 0,
                end: 11,
                bgnPos: 4,
                endPos: 10,
                opens: SyntaxToken.POpen,
                value: "fun",
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("multi openings", () => {
        const t: Token[] = [
            createToken(0, "f", TokenType.Word),
            createToken(1, "("),
            createToken(2, "("),
            createToken(3, "("),
            createToken(4, ")"),
            createToken(5, ")"),
            createToken(6, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [{
                    args: [{
                        args: [{
                            args: [],
                            start: 4,
                            end: 5,
                            bgnPos: 4,
                            endPos: 4,
                            value: "",
                            parseErrors: [{
                                msg: ErrMsg.ParseEmptyParam
                            }]
                        }],
                        start: 3,
                        end: 5,
                        bgnPos: 3,
                        endPos: 5,
                        value: "",
                        opens: SyntaxToken.POpen,
                        parseErrors: [{
                            msg: ErrMsg.ParseUnexpectedOpening
                        }]
                    }],
                    start: 2,
                    end: 6,
                    bgnPos: 2,
                    endPos: 6,
                    value: "",
                    opens: SyntaxToken.POpen,
                    parseErrors: [{
                        msg: ErrMsg.ParseUnexpectedOpening
                    }]
                }],
                start: 0,
                end: 7,
                bgnPos: 2,
                endPos: 6,
                opens: SyntaxToken.POpen,
                value: "f",
            }
        };
        assert.deepStrictEqual(res, expected);
    });

    test("extra closing", () => {
        const t: Token[] = [
            createToken(0, "fun", TokenType.Word),
            createToken(3, "("),
            createToken(4, "12", TokenType.Word),
            createToken(6, ")"),
            createToken(7, ")"),
        ];
        const res = Parser.parseLineTokens(t);
        const expected: Statement = {
            exp: {
                args: [
                    {
                        args: [],
                        start: 4,
                        end: 6,
                        bgnPos: 4,
                        endPos: 6,
                        value: "12"
                    }
                ],
                start: 0,
                end: 7,
                bgnPos: 4,
                endPos: 6,
                opens: SyntaxToken.POpen,
                value: "fun",
                parseErrors: [{
                    msg: `${ErrMsg.ParseUnexpectedToken} (')')`,
                    start: 7,
                    end: 8
                }]
            }
        };
        assert.deepStrictEqual(res, expected);
    });
});