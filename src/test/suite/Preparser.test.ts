import * as assert from "assert";
import { Token, SyntaxToken } from "../../interpreter/model/Token";
import { TokenGroup } from "../../interpreter/model/TokenGroup";
import { PreparsedStatement, Preparser } from "../../interpreter/Preparser";
import { TokenType } from "../../model/TokenType";
import { Utils } from "../../Utils";
import { TestUtils } from "./TestUtils";

suite("Suite for Preparser::" + Preparser.preparse.name, () => {
    test("simple call with trailing closing token", () => {
        const tokens: Token[] = [
            TestUtils.createXToken("foo", 2, TokenType.Word),
            TestUtils.createXToken(SyntaxToken.POpen, 8),
            TestUtils.createXToken("bar", 10, TokenType.Word),
            TestUtils.createXToken(SyntaxToken.PClose, 14),
            TestUtils.createXToken(SyntaxToken.PClose, 15),
        ];
        const result: PreparsedStatement = Preparser.preparse(tokens);
        const expected = new PreparsedStatement([
            tokens[0],
            new TokenGroup(
                [tokens[2]],
                tokens[1],
                tokens[3]
            ),
            Utils.arrayPeek(tokens)!
        ]);
        assert.deepStrictEqual(result, expected);
    });

    test("subsequent openers", () => {
        const tokens: Token[] = [

            TestUtils.createXToken(SyntaxToken.POpen, 8),
            TestUtils.createXToken(SyntaxToken.POpen, 14),
            TestUtils.createXToken(SyntaxToken.POpen, 15),
        ];
        const result: PreparsedStatement = Preparser.preparse(tokens);
        const expected: PreparsedStatement = new PreparsedStatement([
            new TokenGroup(
                [
                    new TokenGroup(
                        [
                            new TokenGroup(
                                [],
                                tokens[2]
                            )
                        ],
                        tokens[1]
                    )
                ],
                tokens[0]
            )
        ]);
        assert.deepStrictEqual(result, expected);
    });

    test("subsequent openers with one token and a comment", () => {
        const tokens: Token[] = [
            TestUtils.createXToken(SyntaxToken.POpen, 8),
            TestUtils.createXToken(SyntaxToken.POpen, 14),
            TestUtils.createXToken("hi", 14, TokenType.Word),
            TestUtils.createXToken(SyntaxToken.POpen, 20),
            TestUtils.createXToken("rem sup", 22, TokenType.Comment),
        ];
        const result: PreparsedStatement = Preparser.preparse(tokens);
        const expected: PreparsedStatement = new PreparsedStatement([
            new TokenGroup(
                [
                    new TokenGroup(
                        [
                            tokens[2],
                            new TokenGroup(
                                [],
                                tokens[3]
                            )
                        ],
                        tokens[1]
                    )
                ],
                tokens[0]
            )
        ], Utils.arrayPeek(tokens));
        assert.deepStrictEqual(result, expected);
    });

    test("comment line parsing", () => {
        const tokens: Token[] = [
            TestUtils.createXToken("rem hi", 0, TokenType.Comment),
        ];
        const result: PreparsedStatement = Preparser.preparse(tokens);
        const expected: PreparsedStatement = new PreparsedStatement([], tokens[0]);
        assert.deepStrictEqual(result, expected);
    });
});