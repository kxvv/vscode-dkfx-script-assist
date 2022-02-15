import * as assert from "assert";
import { Analyzer } from "../../../Analyzer";
import { DescProvider } from "../../../DescProvider";
import { Exp } from "../../../model/Exp";
import { ScriptAnalysis } from "../../../model/ScriptAnalysis";
import { DUMMY_EXP_PARTS, TestUtils } from "../TestUtils";

suite("Suite for Analyzer::" + Analyzer.evalExpSideEffects.name, () => {
    test("party creation and use", () => {
        const exp: Exp = {
            args: [
                {
                    args: [],
                    start: 14,
                    end: 20,
                    value: "myparty",
                    ...DUMMY_EXP_PARTS,
                }
            ],
            start: 0,
            end: 35,
            value: "CREATE_PARTY",
            ...DUMMY_EXP_PARTS,
        };
        const exp2: Exp = {
            args: [
                {
                    args: [],
                    start: 1,
                    end: 1,
                    value: "PLAYER2",
                    ...DUMMY_EXP_PARTS,
                },
                {
                    args: [],
                    start: 1,
                    end: 1,
                    value: "myparty",
                    ...DUMMY_EXP_PARTS,
                },
                {
                    args: [],
                    start: 1,
                    end: 1,
                    value: "4",
                    ...DUMMY_EXP_PARTS,
                },
                {
                    args: [],
                    start: 1,
                    end: 1,
                    value: "2",
                    ...DUMMY_EXP_PARTS,
                },
            ],
            start: 0,
            end: 35,
            value: "ADD_PARTY_TO_LEVEL",
            ...DUMMY_EXP_PARTS,
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            parties: [{
                declareExp: {
                    line: 1,
                    exp,
                },
                name: "myparty",
                adds: [],
                reads: 0,
                dels: 0,
            }]
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExpSideEffects({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 1,
            state: anl
        });
        Analyzer.evalExpSideEffects({
            desc: DescProvider.getCommandDesc(exp2.value)!,
            exp: exp,
            line: 2,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("timer write", () => {
        const exp: Exp = {
            args: [
                {
                    ...DUMMY_EXP_PARTS,
                    args: [],
                    start: 14,
                    end: 20,
                    value: "PLAYER3",
                },
                {
                    ...DUMMY_EXP_PARTS,
                    args: [],
                    start: 14,
                    end: 20,
                    value: "TIMER6"
                },
            ],
            start: 0,
            end: 35,
            value: "SET_TIMER",
            ...DUMMY_EXP_PARTS,
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            timerWrites: [{
                line: 4,
                player: "PLAYER3",
                varname: "TIMER6",
                start: 14,
                end: 20,
            }]
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExpSideEffects({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 4,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("timer read", () => {
        const exp: Exp = {
            args: [
                {
                    ...DUMMY_EXP_PARTS,
                    args: [],
                    start: 14,
                    end: 20,
                    value: "PLAYER3",
                },
                {
                    ...DUMMY_EXP_PARTS,
                    args: [],
                    start: 14,
                    end: 20,
                    value: "TIMER6"
                },
                {
                    ...DUMMY_EXP_PARTS,
                    args: [],
                    start: 22,
                    end: 23,
                    value: "1"
                },
            ],
            start: 0,
            end: 35,
            value: "DISPLAY_TIMER",
            ...DUMMY_EXP_PARTS,
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            timerReads: [{
                line: 4,
                player: "PLAYER3",
                varname: "TIMER6",
                start: 14,
                end: 20
            }]
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExpSideEffects({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 4,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("timer read from condition", () => {
        const exp: Exp = {
            args: [
                {
                    ...DUMMY_EXP_PARTS,
                    args: [],
                    start: 14,
                    end: 20,
                    value: "PLAYER2",
                },
                {
                    ...DUMMY_EXP_PARTS,
                    args: [
                        {
                            ...DUMMY_EXP_PARTS,
                            args: [],
                            start: 19,
                            end: 26,
                            value: "TIMER7",
                        },
                        {
                            ...DUMMY_EXP_PARTS,
                            args: [],
                            start: 28,
                            end: 29,
                            value: "8",
                        }
                    ],
                    start: 14,
                    end: 20,
                    value: "=="
                },
            ],
            start: 0,
            end: 35,
            value: "IF",
            ...DUMMY_EXP_PARTS,
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            timerReads: [{
                line: 4,
                player: "PLAYER2",
                varname: "TIMER7",
                start: 19,
                end: 26
            }]
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExpSideEffects({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 4,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    test("place msgs into slots", () => {
        const exp: Exp = {
            args: [
                {
                    ...DUMMY_EXP_PARTS,
                    args: [],
                    start: 14,
                    end: 15,
                    value: "5",
                },
                {
                    ...DUMMY_EXP_PARTS,
                    args: [],
                    start: 16,
                    end: 20,
                    value: "A",
                },
                {
                    ...DUMMY_EXP_PARTS,
                    args: [],
                    start: 23,
                    end: 33,
                    value: "PLAYER0",
                },
            ],
            start: 0,
            end: 35,
            value: "QUICK_OBJECTIVE",
            ...DUMMY_EXP_PARTS,
            bgnPos: 0,
            endPos: 15,
        };
        const expected: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
            msgSlots: {
                5: [{
                    start: 14,
                    end: 15,
                    line: 4
                }]
            }
        };
        const anl: ScriptAnalysis = {
            ...TestUtils.createScriptAnl(),
        };
        Analyzer.evalExpSideEffects({
            desc: DescProvider.getCommandDesc(exp.value)!,
            exp: exp,
            line: 4,
            state: anl
        });
        assert.deepStrictEqual(
            anl,
            expected
        );
    });

    // test("party creation duplicate", () => {
    //     const exp: Exp = {
    //         args: [
    //             {
    //                 args: [],
    //                 start: 14,
    //                 end: 20,
    //                 value: "myparty",
    //                 ...DUMMY_POS,
    //             }
    //         ],
    //         start: 0,
    //         end: 35,
    //         value: "CREATE_PARTY",
    //         ...DUMMY_POS,
    //     };
    //     const exp2: Exp = {
    //         args: [
    //             {
    //                 args: [],
    //                 start: 12,
    //                 end: 19,
    //                 value: "myparty",
    //                 ...DUMMY_POS,
    //             }
    //         ],
    //         start: 0,
    //         end: 35,
    //         value: "CREATE_PARTY",
    //         ...DUMMY_POS,
    //     };
    //     const expected: ScriptAnalysis = {
    //         diags: [{
    //             start: 12,
    //             end: 19,
    //             line: 2,
    //             msg: ErrMsg.DuplicatePartyDeclaration.replace("$1", "myparty"),
    //             severity: ErrSeverity.Error
    //         }],
    //         parties: [{
    //             declareLine: 1,
    //             name: "myparty"
    //         }]
    //     };
    //     const anl: ScriptAnalysis = {
    //         diags: [],
    //         parties: []
    //     };
    //     Analyzer.evalExpSideEffects({
    //         desc: DescProvider.getCommandDescFromName(exp.value)!,
    //         exp: exp,
    //         line: 1,
    //         state: anl
    //     });
    //     Analyzer.evalExpSideEffects({
    //         desc: DescProvider.getCommandDescFromName(exp2.value)!,
    //         exp: exp2,
    //         line: 2,
    //         state: anl
    //     });
    //     assert.deepStrictEqual(
    //         anl,
    //         expected
    //     );
    // });
});