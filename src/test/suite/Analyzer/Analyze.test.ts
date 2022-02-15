import * as assert from "assert";
import { Analyzer } from "../../../Analyzer";
import { ErrMsg } from "../../../model/ErrMsg";
import { ErrSeverity } from "../../../model/ErrSeverity";
import { ScriptAnalysis } from "../../../model/ScriptAnalysis";
import { LineMap } from "../../../ScriptInstance";
import { DUMMY_EXP_PARTS, TestUtils } from "../TestUtils";

suite("Suite for Analyzer::" + Analyzer.analyze.name, () => {
    test("equal number of condition pushes and pops", () => {
        const lineMap: LineMap = [
            {
                exp: {
                    args: [],
                    start: 0,
                    end: 2,
                    value: "IF",
                    ...DUMMY_EXP_PARTS
                }
            },
            {
                exp: {
                    args: [],
                    start: 2,
                    end: 16,
                    value: "www",
                    ...DUMMY_EXP_PARTS
                }
            },
            {
                exp: {
                    args: [],
                    start: 0,
                    end: 5,
                    value: "ENDIF",
                    ...DUMMY_EXP_PARTS
                }
            },
        ];
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            diags: [{
                start: 2,
                end: 5,
                line: 1,
                msg: ErrMsg.UnknownCommand + ": www",
                severity: ErrSeverity.Error
            }]
        };
        const res = Analyzer.analyze(lineMap);
        assert.deepStrictEqual(res.diags.find(d => d.msg === ErrMsg.UnknownCommand + ": www"), expected.diags[0]);
    });

    test("more condition pushes than pops", () => {
        const lineMap: LineMap = [
            {
                exp: {
                    args: [],
                    start: 0,
                    end: 2,
                    value: "IF",
                    ...DUMMY_EXP_PARTS
                }
            },
            {
                exp: {
                    args: [],
                    start: 4,
                    end: 6,
                    value: "IF",
                    ...DUMMY_EXP_PARTS
                }
            },
        ];
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            diags: [
                {
                    start: 0,
                    end: 2,
                    line: 0,
                    msg: ErrMsg.UnterminatedCondition,
                    severity: ErrSeverity.Error
                },
                {
                    start: 4,
                    end: 6,
                    line: 1,
                    msg: ErrMsg.UnterminatedCondition,
                    severity: ErrSeverity.Error
                }
            ]
        };
        assert.deepStrictEqual(
            Analyzer.analyze(lineMap).diags.filter(d => d.msg === ErrMsg.UnterminatedCondition),
            expected.diags
        );
    });

    test("more condition pops than pushes", () => {
        const lineMap: LineMap = [
            {
                exp: {
                    args: [],
                    start: 0,
                    end: 2,
                    value: "IF",
                    ...DUMMY_EXP_PARTS
                }
            },
            {
                exp: {
                    args: [],
                    start: 4,
                    end: 9,
                    value: "ENDIF",
                    ...DUMMY_EXP_PARTS
                }
            },
            {
                exp: {
                    args: [],
                    start: 4,
                    end: 9,
                    value: "ENDIF",
                    ...DUMMY_EXP_PARTS
                }
            },
        ];
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            diags: [
                {
                    start: 4,
                    end: 9,
                    line: 2,
                    msg: ErrMsg.UnexpectedEndif,
                    severity: ErrSeverity.Error
                }
            ]
        };
        assert.deepStrictEqual(
            Analyzer.analyze(lineMap).diags.filter(d => d.msg === ErrMsg.UnexpectedEndif),
            expected.diags
        );
    });
});