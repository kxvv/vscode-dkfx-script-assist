import * as assert from "assert";
import { XTokenGroup } from "../../interpreter/model/XTokenGroup";
import { PreparsedStatement, XPreparser } from "../../interpreter/XPreparser";
import { XSyntaxToken, XToken } from "../../interpreter/model/XToken";
import { TokenType } from "../../model/TokenType";
import { Utils } from "../../Utils";
import { TestUtils } from "./TestUtils";

suite("Suite for Preparser::" + XPreparser.preparse.name, () => {
    test("simple call with trailing closing token", () => {
        const tokens: XToken[] = [
            TestUtils.createXToken("foo", 2, TokenType.Word),
            TestUtils.createXToken(XSyntaxToken.POpen, 8),
            TestUtils.createXToken("bar", 10, TokenType.Word),
            TestUtils.createXToken(XSyntaxToken.PClose, 14),
            TestUtils.createXToken(XSyntaxToken.PClose, 15),
        ];
        const result: PreparsedStatement = XPreparser.preparse(tokens);
        const expected = new PreparsedStatement([
            tokens[0],
            new XTokenGroup(
                [tokens[2]],
                tokens[1],
                tokens[3]
            ),
            Utils.arrayPeek(tokens)!
        ]);
        assert.deepStrictEqual(result, expected);
    });

    test("subsequent openers", () => {
        const tokens: XToken[] = [

            TestUtils.createXToken(XSyntaxToken.POpen, 8),
            TestUtils.createXToken(XSyntaxToken.POpen, 14),
            TestUtils.createXToken(XSyntaxToken.POpen, 15),
        ];
        const result: PreparsedStatement = XPreparser.preparse(tokens);
        const expected: PreparsedStatement = new PreparsedStatement([
            new XTokenGroup(
                [
                    new XTokenGroup(
                        [
                            new XTokenGroup(
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
        const tokens: XToken[] = [
            TestUtils.createXToken(XSyntaxToken.POpen, 8),
            TestUtils.createXToken(XSyntaxToken.POpen, 14),
            TestUtils.createXToken("hi", 14, TokenType.Word),
            TestUtils.createXToken(XSyntaxToken.POpen, 20),
            TestUtils.createXToken("rem sup", 22, TokenType.Comment),
        ];
        const result: PreparsedStatement = XPreparser.preparse(tokens);
        const expected: PreparsedStatement = new PreparsedStatement([
            new XTokenGroup(
                [
                    new XTokenGroup(
                        [
                            tokens[2],
                            new XTokenGroup(
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
        const tokens: XToken[] = [
            TestUtils.createXToken("rem hi", 0, TokenType.Comment),
        ];
        const result: PreparsedStatement = XPreparser.preparse(tokens);
        const expected: PreparsedStatement = new PreparsedStatement([], tokens[0]);
        assert.deepStrictEqual(result, expected);
    });
});