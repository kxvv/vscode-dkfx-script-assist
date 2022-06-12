import * as assert from "assert";
import { DescProvider } from "../../DescProvider";
import { CommandDesc } from "../../model/CommandDesc";
import { ParamType } from "../../model/ParamType";
import { TestUtils } from "./TestUtils";

suite("Suite for DescProvider::" + DescProvider.getCommandDesc.name, () => {
    test("SET_FLAg", () => {
        const result: CommandDesc | null = DescProvider.getCommandDesc("SET_FLAg")!;
        const expected: CommandDesc = TestUtils.createDesc();
        expected.params.push({
            allowedTypes: [ParamType.AllPlayers, ParamType.Player],
            preSep: false,
            name: "player",
            optional: false,
            final: false,
        });
        expected.params.push({
            allowedTypes: [ParamType.SetVar],
            preSep: true,
            name: "flag",
            optional: false,
            final: false,
        });
        expected.params.push({
            allowedTypes: [ParamType.Number],
            preSep: true,
            name: "value",
            optional: false,
            final: false,
        });
        expected.effects = {
            flagWrite: [1]
        };

        assert.ok(result.doc.length);
        expected.doc = result.doc;
        assert.deepStrictEqual(result, expected);
    });
});