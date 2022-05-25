import * as assert from "assert";
import { XToken } from "../../interpreter/model/XToken";
import { XTokenizer } from "../../interpreter/XTokenizer";
import { TokenType } from "../../model/TokenType";

suite.only("Suite for XTokenizer::" + XTokenizer.tokenize.name, () => {

    test(`fun(-32)`, () => {
        const res = XTokenizer.tokenize(`fun(-32)`);
        const expected: XToken[] = [
            new XToken("fun", 0, TokenType.Word),
            new XToken("(", 3, TokenType.Syntactic),
            new XToken("-32", 4, TokenType.Word),
            new XToken(")", 7, TokenType.Syntactic),
        ];
        assert.deepStrictEqual(res, expected);
    });

    test(` fun(  rem -32)`, () => {
        const res = XTokenizer.tokenize(` fun(  rem -32)`);
        const expected: XToken[] = [
            new XToken("fun", 1, TokenType.Word),
            new XToken("(", 4, TokenType.Syntactic),
            new XToken("rem -32)", 7, TokenType.Comment),
        ];
        assert.deepStrictEqual(res, expected);
    });

    test(`f( 4 = 2 )`, () => {
        const res = XTokenizer.tokenize(`f( 4 = 2 )`);
        const expected: XToken[] = [
            new XToken("f", 0, TokenType.Word),
            new XToken("(", 1, TokenType.Syntactic),
            new XToken("4", 3, TokenType.Word),
            new XToken("=", 5, TokenType.OperatorIncomplete),
            new XToken("2", 7, TokenType.Word),
            new XToken(")", 9, TokenType.Syntactic),
        ];
        assert.deepStrictEqual(res, expected);
    });

    test(`x>"f" "s `, () => {
        const res = XTokenizer.tokenize(`x>"f" "s `);
        const expected: XToken[] = [
            new XToken("x", 0, TokenType.Word),
            new XToken(">", 1, TokenType.Operator),
            new XToken(`"f"`, 2, TokenType.String),
            new XToken(`"s `, 6, TokenType.StringIncomplete),
        ];
        assert.deepStrictEqual(res, expected);
    });
});