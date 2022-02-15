import * as assert from "assert";
import { Analyzer } from "../../../Analyzer";
import { DkDiag } from "../../../model/DkDiag";
import { ErrSeverity } from "../../../model/ErrSeverity";
import { Exp } from "../../../model/Exp";
import { DUMMY_EXP_PARTS } from "../TestUtils";

suite("Suite for Analyzer::" + Analyzer.collectOneLineParseErrors.name, () => {
    test("no args, no errs", () => {
        const e: Exp = {
            args: [],
            start: 0,
            end: 2,
            value: "ok",
            ...DUMMY_EXP_PARTS
        };
        const expected: DkDiag[] = [];
        assert.deepStrictEqual(Analyzer.collectOneLineParseErrors(e, 43), expected);
    });

    test("no args, 2 errs", () => {
        const e: Exp = {
            args: [],
            start: 0,
            end: 2,
            value: "ok",
            ...DUMMY_EXP_PARTS,
            parseErrors: [
                {
                    msg: "one",
                },
                {
                    msg: "two",
                    start: 2,
                    end: 5
                }
            ]
        };
        const expected: DkDiag[] = [
            {
                start: 0,
                end: 2,
                msg: "one",
                line: 43,
                severity: ErrSeverity.Error
            },
            {
                start: 2,
                end: 5,
                msg: "two",
                line: 43,
                severity: ErrSeverity.Error
            }
        ];
        assert.deepStrictEqual(Analyzer.collectOneLineParseErrors(e, 43), expected);
    });

    test("2 args, 1 + 1 nested errs", () => {
        const e: Exp = {
            args: [
                {
                    args: [],
                    start: 3,
                    end: 4,
                    value: "oj",
                    ...DUMMY_EXP_PARTS
                },
                {
                    args: [],
                    start: 6,
                    end: 8,
                    value: "oh",
                    parseErrors: [
                        {
                            msg: "two"
                        }
                    ],
                    ...DUMMY_EXP_PARTS
                },
            ],
            start: 0,
            end: 21,
            value: "ok",
            parseErrors: [
                {
                    msg: "one",
                    start: 2,
                    end: 5
                }
            ],
            ...DUMMY_EXP_PARTS
        };
        const expected: DkDiag[] = [
            {
                start: 2,
                end: 5,
                msg: "one",
                line: 43,
                severity: ErrSeverity.Error
            },
            {
                start: 6,
                end: 8,
                msg: "two",
                line: 43,
                severity: ErrSeverity.Error
            },
        ];
        assert.deepStrictEqual(Analyzer.collectOneLineParseErrors(e, 43), expected);
    });
});