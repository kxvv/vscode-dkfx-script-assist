import * as assert from "assert";
import { TokenIndexMap } from "../../../model/TokenIndexMap";
import { TokenType } from "../../../model/TokenType";
import { Tokenizer } from "../../../Tokenizer";


suite("Suite for Tokenizer::" + Tokenizer.getOperatorTokensMap.name, () => {
    test("simple operator token map", () => {
        const res = Tokenizer.getOperatorTokensMap(`4>2`);
        const exp: TokenIndexMap = {
            "1": {
                val: ">",
                start: 1,
                end: 2,
                type: TokenType.Operator
            },
        };
        assert.deepStrictEqual(res, exp);
    });

    test("mix of complete and incomplete operators", () => {
        const res = Tokenizer.getOperatorTokensMap(`> != = ! <=`);
        const exp: TokenIndexMap = {
            "0": {
                val: ">",
                start: 0,
                end: 1,
                type: TokenType.Operator
            },
            "2": {
                val: "!=",
                start: 2,
                end: 4,
                type: TokenType.Operator
            },
            "5": {
                val: "=",
                start: 5,
                end: 6,
                type: TokenType.OperatorIncomplete
            },
            "7": {
                val: "!",
                start: 7,
                end: 8,
                type: TokenType.OperatorIncomplete
            },
            "9": {
                val: "<=",
                start: 9,
                end: 11,
                type: TokenType.Operator
            },
        };
        assert.deepStrictEqual(res, exp);
    });
});