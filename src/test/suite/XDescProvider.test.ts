import * as assert from "assert";
import { ParamType } from "../../model/ParamType";
import { XCommandDesc } from "../../model/XCommandDesc";
import { CommandEffectFactory } from "../../model/XCommandEffect";
import { XDescProvider } from "../../XDescProvider";
import { TestUtils } from "./TestUtils";

suite.only("Suite for XDescProvider::" + XDescProvider.getCommandDesc.name, () => {
    test("SET_FLAg", () => {
        const result: XCommandDesc | null = XDescProvider.getCommandDesc("SET_FLAg")!;
        const expected: XCommandDesc = TestUtils.createDesc();
        expected.params.push({
            allowedTypes: [ParamType.Player],
            preSep: false,
            name: "player",
            optional: false,
        });
        expected.params.push({
            allowedTypes: [ParamType.CampaignFlag, ParamType.CustomBox, ParamType.Flag],
            preSep: true,
            name: "flag",
            optional: false,
        });
        expected.params.push({
            allowedTypes: [ParamType.Number],
            preSep: true,
            name: "value",
            optional: false,
        });
        expected.effects.push(CommandEffectFactory.flagWrite());

        assert.deepStrictEqual(result.effects.length, expected.effects.length);
        // TODO 
        result.effects.pop();
        expected.effects.pop();
        assert.deepStrictEqual(result, expected);
    });

    test("IF", () => {
        const result: XCommandDesc | null = XDescProvider.getCommandDesc("IF")!;
        const expected: XCommandDesc = TestUtils.createDesc();
        expected.params.push({
            allowedTypes: [ParamType.Player],
            preSep: false,
            name: "player",
            optional: false,
        });
        expected.params.push({
            allowedTypes: [ParamType.ReadVar,ParamType.SetVar],
            preSep: true,
            name: "left B",
            optional: false,
        });
        expected.params.push({
            allowedTypes: [ParamType.CompareOperator],
            preSep: false,
            name: "operator",
            optional: false,
        });
        expected.params.push({
            allowedTypes: [ParamType.Number, ParamType.Player],
            preSep: false,
            name: "right A",
            optional: false,
        });
        expected.params.push({
            allowedTypes: [ParamType.ReadVar,ParamType.SetVar],
            preSep: true,
            name: "right B",
            optional: true,
        });
        expected.effects.push(CommandEffectFactory.conditionPush());

        assert.deepStrictEqual(result.effects.length, expected.effects.length);
        // TODO 
        result.effects.pop();
        expected.effects.pop();
        assert.deepStrictEqual(result, expected);
    });
});