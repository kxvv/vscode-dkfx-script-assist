import * as assert from "assert";
import { Token } from "../../interpreter/model/Token";
import { Tokenizer } from "../../interpreter/Tokenizer";
import { TokenType } from "../../model/TokenType";

suite("Suite for XTokenizer::" + Tokenizer.tokenize.name, () => {

    test(`fun(-32)`, () => {
        const res = Tokenizer.tokenize(`fun(-32)`);
        const expected: Token[] = [
            new Token("fun", 0, TokenType.Word),
            new Token("(", 3, TokenType.Syntactic),
            new Token("-32", 4, TokenType.Word),
            new Token(")", 7, TokenType.Syntactic),
        ];
        assert.deepStrictEqual(res, expected);
    });

    test(` fun(  rem -32)`, () => {
        const res = Tokenizer.tokenize(` fun(  rem -32)`);
        const expected: Token[] = [
            new Token("fun", 1, TokenType.Word),
            new Token("(", 4, TokenType.Syntactic),
            new Token("rem -32)", 7, TokenType.Comment),
        ];
        assert.deepStrictEqual(res, expected);
    });

    test(`f( 4 = 2 )`, () => {
        const res = Tokenizer.tokenize(`f( 4 = 2 )`);
        const expected: Token[] = [
            new Token("f", 0, TokenType.Word),
            new Token("(", 1, TokenType.Syntactic),
            new Token("4", 3, TokenType.Word),
            new Token("=", 5, TokenType.OperatorIncomplete),
            new Token("2", 7, TokenType.Word),
            new Token(")", 9, TokenType.Syntactic),
        ];
        assert.deepStrictEqual(res, expected);
    });

    test(`x>"f" "s `, () => {
        const res = Tokenizer.tokenize(`x>"f" "s `);
        const expected: Token[] = [
            new Token("x", 0, TokenType.Word),
            new Token(">", 1, TokenType.Operator),
            new Token(`"f"`, 2, TokenType.String),
            new Token(`"s `, 6, TokenType.StringIncomplete),
        ];
        assert.deepStrictEqual(res, expected);
    });
});