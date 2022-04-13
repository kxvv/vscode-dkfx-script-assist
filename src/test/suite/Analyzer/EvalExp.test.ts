import * as assert from "assert";
import { Analyzer } from "../../../Analyzer";
import { DescProvider } from "../../../DescProvider";
import { ErrMsgUtils } from "../../../ErrMsgUtils";
import { ErrMsg } from "../../../model/ErrMsg";
import { ErrSeverity } from "../../../model/ErrSeverity";
import { Exp } from "../../../model/Exp";
import { ParamType } from "../../../model/ParamType";
import { ScriptAnalysis } from "../../../model/ScriptAnalysis";
import { createExp, DUMMY_EXP_PARTS, TestUtils } from "../TestUtils";

suite("Suite for Analyzer::" + Analyzer.evalExp.name, () => {
    test("no type errs", () => {
        const exp: Exp = {
            args: [
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 18,
                    end: 19,
                    value: "2",
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 20,
                    end: 26,
                    value: `"a12b"`
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 27,
                    end: 34,
                    value: "PLAYER0"
                }
            ],
            ...DUMMY_EXP_PARTS,
            start: 0,
            end: 35,
            value: "QUICK_OBJECTIVE"
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl()
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl()
        };
        Analyzer.evalExp({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 1,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("too many params", () => {
        const exp: Exp = {
            args: [
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 18,
                    end: 19,
                    value: "2",
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 20,
                    end: 26,
                    value: `"a12b"`
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 27,
                    end: 34,
                    value: "PLAYER2"
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 35,
                    end: 36,
                    value: "r"
                },
            ],
            start: 0,
            end: 38,
            ...DUMMY_EXP_PARTS,
            value: "QUICK_OBJECTIVE"
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            diags: [{
                start: exp.start,
                end: exp.start + exp.value.length,
                line: 1,
                severity: ErrSeverity.Error,
                msg: ErrMsg.TypeExtraParams.replace("$1", "" + 3)
            }],
            parties: []
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExp({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 1,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("too few params", () => {
        const exp: Exp = {
            args: [],
            ...DUMMY_EXP_PARTS,
            start: 0,
            end: 35,
            value: "QUICK_OBJECTIVE"
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            diags: [{
                start: exp.start,
                end: exp.start + exp.value.length,
                line: 1,
                severity: ErrSeverity.Error,
                msg: ErrMsgUtils.getMissingParamsMsg(2, 3)
            }],
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExp({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 1,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("double type mismatch", () => {
        const exp: Exp = {
            args: [
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 18,
                    end: 19,
                    value: "2",
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 20,
                    end: 26,
                    value: "TIMER2"
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 27,
                    end: 34,
                    value: "TIMER5"
                }
            ],
            start: 0,
            end: 36,
            ...DUMMY_EXP_PARTS,
            value: "QUICK_OBJECTIVE"
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            diags: [
                {
                    start: 20,
                    end: 26,
                    line: 1,
                    msg: ErrMsgUtils.getTypeMismatchMsg([ParamType.Text], "TIMER2"),
                    severity: ErrSeverity.Error
                },
                {
                    start: 27,
                    end: 34,
                    line: 1,
                    msg: ErrMsgUtils.getTypeMismatchMsg([ParamType.AllPlayers, ParamType.Location], "TIMER5"),
                    severity: ErrSeverity.Error
                }
            ]
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExp({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 1,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("type mismatch", () => {
        const exp: Exp = {
            args: [
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 18,
                    end: 19,
                    value: "2",
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 20,
                    end: 26,
                    value: "TIMER2"
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 27,
                    end: 34,
                    value: "ALL_PLAYERS"
                }
            ],
            start: 0,
            end: 36,
            ...DUMMY_EXP_PARTS,
            value: "QUICK_OBJECTIVE"
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            diags: [{
                start: 20,
                end: 26,
                line: 1,
                msg: ErrMsgUtils.getTypeMismatchMsg([ParamType.Text], "TIMER2"),
                severity: ErrSeverity.Error
            }]
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExp({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 1,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("party use before declaration", () => {
        const exp2: Exp = {
            args: [
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 1,
                    end: 1,
                    value: "PLAYER2",
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 3,
                    end: 9,
                    value: "MYPARTY",
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 1,
                    end: 1,
                    value: "4",
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 1,
                    end: 1,
                    value: "2",
                },
            ],
            start: 0,
            end: 35,
            ...DUMMY_EXP_PARTS,
            value: "ADD_PARTY_TO_LEVEL"
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            diags: [{
                start: 3,
                end: 9,
                line: 2,
                msg: ErrMsgUtils.getUnknownPartyMsg("MYPARTY"),
                severity: ErrSeverity.Error
            }]
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExp({
            desc: DescProvider.getCommandDesc(exp2.value)!,
            exp: exp2,
            line: 2,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("comparison types are derived: success", () => {
        const exp: Exp = {
            args: [
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 5,
                    end: 10,
                    value: "PLAYER0",
                },
                {
                    args: [
                        {
                            start: 12,
                            end: 17,
                            args: [],
                            ...DUMMY_EXP_PARTS,
                            value: "TIMER1",
                        },
                        {
                            start: 19,
                            end: 23,
                            args: [],
                            ...DUMMY_EXP_PARTS,
                            value: "2400",
                        }
                    ],
                    ...DUMMY_EXP_PARTS,
                    start: 12,
                    end: 34,
                    value: ">"
                }
            ],
            ...DUMMY_EXP_PARTS,
            start: 0,
            end: 36,
            value: "IF"
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExp({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 1,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("comparison types are derived: type mismatch", () => {
        const exp: Exp = {
            args: [
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 5,
                    end: 10,
                    value: "PLAYER0",
                },
                {
                    args: [
                        {
                            start: 12,
                            end: 17,
                            args: [],
                            ...DUMMY_EXP_PARTS,
                            value: "TIMER1",
                        },
                        {
                            start: 19,
                            end: 23,
                            args: [],
                            ...DUMMY_EXP_PARTS,
                            value: "TIMER4",
                        }
                    ],
                    start: 12,
                    end: 34,
                    value: ">",
                    ...DUMMY_EXP_PARTS,
                }
            ],
            start: 0,
            end: 36,
            value: "IF",
            ...DUMMY_EXP_PARTS,
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            diags: [{
                start: 19,
                end: 23,
                line: 1,
                msg: ErrMsgUtils.getTypeMismatchMsg([ParamType.Number], "TIMER4"),
                severity: ErrSeverity.Error
            }]
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExp({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 1,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("range in drawfrom should push diag when expecting action point", () => {
        const exp: Exp = {
            args: [
                {
                    args: [{
                        args: [
                            createExp("2", 5),
                            createExp("9", 7)
                        ],
                        start: 6,
                        end: 8,
                        value: "~",
                        ...DUMMY_EXP_PARTS,
                    }],
                    start: 5,
                    end: 29,
                    value: "DRAWFROM",
                    ...DUMMY_EXP_PARTS,
                },
                {
                    args: [],
                    ...DUMMY_EXP_PARTS,
                    start: 31,
                    end: 34,
                    value: "RED"
                }
            ],
            start: 0,
            end: 36,
            value: "IF_ACTION_POINT",
            ...DUMMY_EXP_PARTS,
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            diags: [{
                start: 6,
                end: 8,
                line: 1,
                msg: ErrMsg.TypeRangeNonConsecutive,
                severity: ErrSeverity.Error
            }]
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExp({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 1,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("range in comparison's number should push diag when not in drawfrom", () => {
        const exp: Exp = {
            args: [
                createExp("PLAYER0", 2),
                {
                    args: [
                        createExp("FLAG0", 5),
                        {
                            args: [createExp("11", 11), createExp("13", 13)],
                            start: 6,
                            end: 8,
                            value: "~",
                            ...DUMMY_EXP_PARTS,
                        }],
                    start: 5,
                    end: 29,
                    value: ">=",
                    ...DUMMY_EXP_PARTS,
                }
            ],
            start: 0,
            end: 36,
            value: "IF",
            ...DUMMY_EXP_PARTS,
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            diags: [
                {
                    start: 6,
                    end: 8,
                    line: 1,
                    msg: ErrMsgUtils.getTypeMismatchMsg([ParamType.Number], "~"),
                    severity: ErrSeverity.Error
                }
            ]
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExp({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 1,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });
});