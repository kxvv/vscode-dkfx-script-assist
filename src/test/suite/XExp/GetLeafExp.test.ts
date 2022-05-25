import * as assert from "assert";
import { XExp } from "../../../interpreter/model/XExp";
import { XParsedLine } from "../../../interpreter/model/XParsedLine";
import { Preparser } from "../../../interpreter/Preparser";
import { XParser } from "../../../interpreter/XParser";
import { XTokenizer } from "../../../interpreter/XTokenizer";

suite.only("Suite for XExp::" + XExp.prototype.getLeafExp.name, () => {

    test(`5 @ abc(a,x,55,`, () => {
        const input = "abc(a,x,55,";
        const preparsed = Preparser.preparse(XTokenizer.tokenize(input));
        const parsed: XParsedLine = XParser.parse(preparsed);
        if (parsed.exp instanceof XExp) {
            const expected: XExp | null = parsed.exp.getLeafExp(5);
            if (expected) {
                assert.deepStrictEqual(expected.caller.val, "abc");
            } else {
                assert.fail("null leaf");
            }
        } else {
            assert.fail("not parsed exp");
        }
    });

    test(`15 @ abc(a,x,55, g(hi,44) ,  xxx)`, () => {
        const input = "abc(a,x,55, g(hi,44) ,  xxx)";
        const preparsed = Preparser.preparse(XTokenizer.tokenize(input));
        const parsed: XParsedLine = XParser.parse(preparsed);
        if (parsed.exp instanceof XExp) {
            const expected: XExp | null = parsed.exp.getLeafExp(15);
            if (expected) {
                assert.deepStrictEqual(expected.caller.val, "g");
            } else {
                assert.fail("null leaf");
            }
        } else {
            assert.fail("not parsed exp");
        }
    });

    test(`20 @ abc(a,x,55, g(hi,44) ,  xxx)`, () => {
        const input = "abc(a,x,55, g(hi,44) ,  xxx)";
        const preparsed = Preparser.preparse(XTokenizer.tokenize(input));
        const parsed: XParsedLine = XParser.parse(preparsed);
        if (parsed.exp instanceof XExp) {
            const expected: XExp | null = parsed.exp.getLeafExp(20);
            if (expected) {
                assert.deepStrictEqual(expected.caller.val, "abc");
            } else {
                assert.fail("null leaf");
            }
        } else {
            assert.fail("not parsed exp");
        }
    });

    test(`18 @ abc(a, g(hi,44, f(`, () => {
        const input = "abc(a, g(hi,44, f(";
        const preparsed = Preparser.preparse(XTokenizer.tokenize(input));
        const parsed: XParsedLine = XParser.parse(preparsed);
        if (parsed.exp instanceof XExp) {
            const expected: XExp | null = parsed.exp.getLeafExp(18);
            if (expected) {
                assert.deepStrictEqual(expected.caller.val, "f");
            } else {
                assert.fail("null leaf");
            }
        } else {
            assert.fail("not parsed exp");
        }
    });

    test(`17 @ abc(a, g(hi,44, f(`, () => {
        const input = "abc(a, g(hi,44, f(";
        const preparsed = Preparser.preparse(XTokenizer.tokenize(input));
        const parsed: XParsedLine = XParser.parse(preparsed);
        if (parsed.exp instanceof XExp) {
            const expected: XExp | null = parsed.exp.getLeafExp(17);
            if (expected) {
                assert.deepStrictEqual(expected.caller.val, "g");
            } else {
                assert.fail("null leaf");
            }
        } else {
            assert.fail("not parsed exp");
        }
    });

    test(`1 @ abc(a, g(hi,44, f(`, () => {
        const input = "abc(a, g(hi,44, f(";
        const preparsed = Preparser.preparse(XTokenizer.tokenize(input));
        const parsed: XParsedLine = XParser.parse(preparsed);
        if (parsed.exp instanceof XExp) {
            assert.deepStrictEqual(parsed.exp.getLeafExp(1), null);
        } else {
            assert.fail("not parsed exp");
        }
    });
});