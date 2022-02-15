import * as assert from "assert";
import { Token } from "../../../model/Token";
import { TokenType } from "../../../model/TokenType";
import { Tokenizer } from "../../../Tokenizer";

suite("Suite for Tokenizer::" + Tokenizer.tokenize.name, () => {
    test("simple tokenizing test", () => {
        const res = Tokenizer.tokenize(`fun(-32)`);
        const exp: Token[] = [
            {
                val: "fun",
                start: 0,
                end: 3,
                type: TokenType.Word
            },
            {
                val: "(",
                start: 3,
                end: 4,
                type: TokenType.Syntactic
            },
            {
                val: "-32",
                start: 4,
                end: 7,
                type: TokenType.Word
            },
            {
                val: ")",
                start: 7,
                end: 8,
                type: TokenType.Syntactic
            },
        ];
        assert.deepStrictEqual(res, exp);
    });

    test("tokenizing incomplete string", () => {
        const res = Tokenizer.tokenize(`fun("32)`);
        const exp: Token[] = [
            {
                val: "fun",
                start: 0,
                end: 3,
                type: TokenType.Word
            },
            {
                val: "(",
                start: 3,
                end: 4,
                type: TokenType.Syntactic
            },
            {
                val: `"32)`,
                start: 4,
                end: 8,
                type: TokenType.StringIncomplete
            },
        ];
        assert.deepStrictEqual(res, exp);
    });

    test("tokenizing operator", () => {
        const res = Tokenizer.tokenize(`4!=2`);
        const exp: Token[] = [
            {
                val: "4",
                start: 0,
                end: 1,
                type: TokenType.Word
            },
            {
                val: "!=",
                start: 1,
                end: 3,
                type: TokenType.Operator
            },
            {
                val: "2",
                start: 3,
                end: 4,
                type: TokenType.Word
            },
        ];
        assert.deepStrictEqual(res, exp);
    });

    test("tokenizing with incomplete operator", () => {
        const res = Tokenizer.tokenize(`if(red, money=4)`);
        const exp: Token[] = [
            {
                val: "if",
                start: 0,
                end: 2,
                type: TokenType.Word
            },
            {
                val: "(",
                start: 2,
                end: 3,
                type: TokenType.Syntactic
            },
            {
                val: "red",
                start: 3,
                end: 6,
                type: TokenType.Word
            },
            {
                val: ",",
                start: 6,
                end: 7,
                type: TokenType.Syntactic
            },
            {
                val: "money",
                start: 8,
                end: 13,
                type: TokenType.Word
            },
            {
                val: "=",
                start: 13,
                end: 14,
                type: TokenType.OperatorIncomplete
            },
            {
                val: "4",
                start: 14,
                end: 15,
                type: TokenType.Word
            },
            {
                val: ")",
                start: 15,
                end: 16,
                type: TokenType.Syntactic
            },
        ];
        assert.deepStrictEqual(res, exp);
    });

    test("should merge everything after comment start into one token", () => {
        const res = Tokenizer.tokenize(`f(rem this, is, a comment`);
        const exp: Token[] = [
            {
                val: "f",
                start: 0,
                end: 1,
                type: TokenType.Word
            },
            {
                val: "(",
                start: 1,
                end: 2,
                type: TokenType.Syntactic
            },
            {
                val: "rem this, is, a comment",
                start: 2,
                end: 25,
                type: TokenType.Comment
            },
        ];
        assert.deepStrictEqual(res, exp);
    });

    test("string is one token", () => {
        const res = Tokenizer.tokenize(` fun(2, "u, o", red) rem`);
        const exp: Token[] = [
            {
                val: "fun",
                start: 1,
                end: 4,
                type: TokenType.Word
            },
            {
                val: "(",
                start: 4,
                end: 5,
                type: TokenType.Syntactic
            },
            {
                val: "2",
                start: 5,
                end: 6,
                type: TokenType.Word
            },
            {
                val: ",",
                start: 6,
                end: 7,
                type: TokenType.Syntactic
            },
            {
                val: `"u, o"`,
                start: 8,
                end: 14,
                type: TokenType.String
            },
            {
                val: ",",
                start: 14,
                end: 15,
                type: TokenType.Syntactic
            },
            {
                val: "red",
                start: 16,
                end: 19,
                type: TokenType.Word
            },
            {
                val: ")",
                start: 19,
                end: 20,
                type: TokenType.Syntactic
            },
            {
                val: "rem",
                start: 21,
                end: 24,
                type: TokenType.Comment
            },
        ];
        assert.deepStrictEqual(res, exp);
    });

    test("two tokens as one arg", () => {
        const res = Tokenizer.tokenize(`fun(2 red)`);
        const exp: Token[] = [
            {
                val: "fun",
                start: 0,
                end: 3,
                type: TokenType.Word
            },
            {
                val: "(",
                start: 3,
                end: 4,
                type: TokenType.Syntactic
            },
            {
                val: "2",
                start: 4,
                end: 5,
                type: TokenType.Word
            },
            {
                val: "red",
                start: 6,
                end: 9,
                type: TokenType.Word
            },
            {
                val: ")",
                start: 9,
                end: 10,
                type: TokenType.Syntactic
            },
        ];
        assert.deepStrictEqual(res, exp);
    });

    test("extra whitespace", () => {
        const res = Tokenizer.tokenize(`fun(                32     )    `);
        const exp: Token[] = [
            {
                val: "fun",
                start: 0,
                end: 3,
                type: TokenType.Word
            },
            {
                val: "(",
                start: 3,
                end: 4,
                type: TokenType.Syntactic
            },
            {
                val: "32",
                start: 20,
                end: 22,
                type: TokenType.Word
            },
            {
                val: ")",
                start: 27,
                end: 28,
                type: TokenType.Syntactic
            },
        ];
        assert.deepStrictEqual(res, exp);
    });
});