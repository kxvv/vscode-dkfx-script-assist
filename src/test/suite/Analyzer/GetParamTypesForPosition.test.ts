import * as assert from "assert";
import { Analyzer } from "../../../Analyzer";
import { Exp } from "../../../model/Exp";
import { ParamType } from "../../../model/ParamType";

suite("Suite for Analyzer::" + Analyzer.getParamTypesForPosition.name, () => {
    test("simple", () => {
        // SET_TIMER(PLAYER0, TIMER0)
        const e: Exp = {
            start: 0,
            end: 26,
            bgnPos: 10,
            endPos: 25,
            value: "SET_TIMER",
            args: [
                {
                    start: 10,
                    end: 17,
                    bgnPos: 10,
                    endPos: 17,
                    value: "PLAYER0",
                    args: []
                },
                {
                    start: 19,
                    end: 25,
                    bgnPos: 18,
                    endPos: 25,
                    value: "TIMER0",
                    args: []
                }
            ]
        };
        assert.deepStrictEqual(
            Analyzer.getParamTypesForPosition({ exp: e }, 12),
            [ParamType.Player]
        );
    });

    test("just before comma", () => {
        // SET_TIMER(PLAYER0, TIMER0)
        const e: Exp = {
            start: 0,
            end: 26,
            bgnPos: 10,
            endPos: 25,
            value: "SET_TIMER",
            args: [
                {
                    start: 10,
                    end: 17,
                    bgnPos: 10,
                    endPos: 17,
                    value: "PLAYER0",
                    args: []
                },
                {
                    start: 19,
                    end: 25,
                    bgnPos: 18,
                    endPos: 25,
                    value: "TIMER0",
                    args: []
                }
            ]
        };
        assert.deepStrictEqual(
            Analyzer.getParamTypesForPosition({ exp: e }, 17),
            [ParamType.Player]
        );
    });

    test("at whitespace", () => {
        // SET_TIMER(PLAYER0, TIMER0)
        const e: Exp = {
            start: 0,
            end: 26,
            bgnPos: 10,
            endPos: 25,
            value: "SET_TIMER",
            args: [
                {
                    start: 10,
                    end: 17,
                    bgnPos: 10,
                    endPos: 17,
                    value: "PLAYER0",
                    args: []
                },
                {
                    start: 19,
                    end: 25,
                    bgnPos: 18,
                    endPos: 25,
                    value: "TIMER0",
                    args: []
                }
            ]
        };
        assert.deepStrictEqual(
            Analyzer.getParamTypesForPosition({ exp: e }, 18),
            [ParamType.Timer]
        );
    });

    test("derived", () => {
        // SET_TIMER(PLAYER0, DRAWFROM(1,))
        const e: Exp = {
            start: 0,
            end: 32,
            bgnPos: 10,
            endPos: 31,
            value: "SET_TIMER",
            args: [
                {
                    start: 10,
                    end: 17,
                    bgnPos: 10,
                    endPos: 17,
                    value: "PLAYER0",
                    args: []
                },
                {
                    start: 19,
                    end: 31,
                    bgnPos: 28,
                    endPos: 30,
                    value: "DRAWFROM",
                    args: [
                        {
                            start: 28,
                            end: 29,
                            bgnPos: 28,
                            endPos: 29,
                            value: "1",
                            args: []
                        },
                        {
                            start: 30,
                            end: 30,
                            bgnPos: 30,
                            endPos: 30,
                            value: "",
                            args: []
                        }
                    ]
                }
            ]
        };
        assert.deepStrictEqual(
            Analyzer.getParamTypesForPosition({ exp: e }, 30),
            [ParamType.Timer]
        );
    });

    test("altern", () => {
        const e: Exp = {
            start: 0,
            end: 100,
            bgnPos: 16,
            endPos: 99,
            value: "QUICK_OBJECTIVE",
            args: [
                {
                    start: 16,
                    end: 17,
                    bgnPos: 16,
                    endPos: 17,
                    value: "1",
                    args: []
                },
                {
                    start: 18,
                    end: 19,
                    bgnPos: 18,
                    endPos: 19,
                    value: "1",
                    args: []
                },
                {
                    start: 50,
                    end: 51,
                    bgnPos: 40,
                    endPos: 99,
                    value: "1",
                    args: []
                },
            ]
        };
        assert.deepStrictEqual(
            Analyzer.getParamTypesForPosition({ exp: e }, 40),
            [ParamType.AllPlayers, ParamType.Location]
        );
    });
});