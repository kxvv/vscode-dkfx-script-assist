import * as assert from "assert";
import { DescProvider } from "../../../DescProvider";
import { CommandDesc } from "../../../model/CommandDesc";
import { Exp } from "../../../model/Exp";
import { ParamType } from "../../../model/ParamType";
import { createExp, DUMMY_EXP_PARTS } from "../TestUtils";

suite("Suite for DescProvider::" + DescProvider.deriveCommandDesc.name, () => {
    test("classic comparison operator", () => {
        const expected: CommandDesc = {
            params: [
                {
                    optional: false,
                    allowedTypes: [
                        ParamType.Flag, ParamType.Timer, ParamType.Global,
                        ParamType.Creature, ParamType.Room, ParamType.Power,
                        ParamType.Trap, ParamType.Door, ParamType.CustomBox
                    ]
                },
                {
                    optional: false,
                    allowedTypes: [ParamType.Number]
                },
            ],
        };
        assert.deepStrictEqual(
            DescProvider.deriveCommandDesc({
                args: [],
                start: 1,
                end: 1,
                value: ">=",
                ...DUMMY_EXP_PARTS,
            }, [ParamType.Comparison]
            ), expected
        );
    });

    test("range operator", () => {
        const expected: CommandDesc = {
            params: [
                {
                    optional: false,
                    allowedTypes: [ParamType.Number]
                },
                {
                    optional: false,
                    allowedTypes: [ParamType.Number]
                },
            ],
        };
        assert.deepStrictEqual(DescProvider.deriveCommandDesc(
            {
                args: [],
                start: 1,
                end: 1,
                value: "~",
                ...DUMMY_EXP_PARTS,
            }, []), expected
        );
    });

    test("drawfrom derived", () => {
        const exp: Exp = {
            args: [createExp("1", 2)],
            start: 1,
            end: 1,
            value: "DRAWFROM",
            ...DUMMY_EXP_PARTS,
        };
        const expected: CommandDesc = {
            opts: 7,
            returns: [ParamType.Text, ParamType.Timer],
            autoTypes: true,
            params: [
                {
                    optional: false,
                    allowedTypes: [ParamType.Text, ParamType.Timer],
                    name: "value1",
                },
                {
                    optional: true,
                    allowedTypes: [ParamType.Text, ParamType.Timer],
                    name: "value2",
                },
                {
                    optional: true,
                    allowedTypes: [ParamType.Text, ParamType.Timer],
                    name: "value3",
                },
                {
                    optional: true,
                    allowedTypes: [ParamType.Text, ParamType.Timer],
                    name: "value4",
                },
                {
                    optional: true,
                    allowedTypes: [ParamType.Text, ParamType.Timer],
                    name: "value5",
                },
                {
                    optional: true,
                    allowedTypes: [ParamType.Text, ParamType.Timer],
                    name: "value6",
                },
                {
                    optional: true,
                    allowedTypes: [ParamType.Text, ParamType.Timer],
                    name: "value7",
                },
                {
                    optional: true,
                    allowedTypes: [ParamType.Text, ParamType.Timer],
                    name: "value8",
                },
            ],
        };
        const actual = DescProvider.deriveCommandDesc(exp, [ParamType.Text, ParamType.Timer]);
        delete actual?.doc;
        assert.deepStrictEqual(
            actual, expected
        );
    });
});