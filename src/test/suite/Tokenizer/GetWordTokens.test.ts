import * as assert from "assert";
import { TokenIndexMap } from "../../../model/TokenIndexMap";
import { TokenType } from "../../../model/TokenType";
import { Tokenizer } from "../../../Tokenizer";

suite("Suite for Tokenizer::" + Tokenizer.getWordTokensMap.name, () => {
    test("should return word token map indexed by start indices", () => {
        const res = Tokenizer.getWordTokensMap(`F(1, "eh, oh", RED) rem comment`);
        const exp: TokenIndexMap = {
            "0": {
                val: "F",
                start: 0,
                end: 1,
                type: TokenType.Word
            },
            "2": {
                val: "1",
                start: 2,
                end: 3,
                type: TokenType.Word
            },
            "6": {
                val: "eh",
                start: 6,
                end: 8,
                type: TokenType.Word
            },
            "10": {
                val: "oh",
                start: 10,
                end: 12,
                type: TokenType.Word
            },
            "15": {
                val: "RED",
                start: 15,
                end: 18,
                type: TokenType.Word
            },
            "20": {
                val: "rem",
                start: 20,
                end: 23,
                type: TokenType.Word
            },
            "24": {
                val: "comment",
                start: 24,
                end: 31,
                type: TokenType.Word
            },
        };
        assert.deepStrictEqual(res, exp);
    });
});