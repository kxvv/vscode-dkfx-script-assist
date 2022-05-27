import * as assert from "assert";
import { ParamType } from "../../model/ParamType";
import { XCommandDesc } from "../../model/XCommandDesc";
import { CommandEffectFactory } from "../../model/XCommandEffect";
import { XDescParam } from "../../model/XDescParam";
import { XDescProvider } from "../../XDescProvider";

const TEST_DOC = "test_doc";

suite("Suite for XDescProvider::" + XDescProvider.getCommandDesc.name, () => {
    test("SET_FLAg", () => {
        const result: XCommandDesc | null = XDescProvider.getCommandDesc("SET_FLAg")!;
        const expected: XCommandDesc = new XCommandDesc;
        expected.parts.push(new XDescParam({
            allowedTypes: [ParamType.Player],
            expectsSep: true,
            name: "player",
            optional: false,
        }));
        expected.parts.push(new XDescParam({
            allowedTypes: [ParamType.CampaignFlag, ParamType.CustomBox, ParamType.Flag],
            expectsSep: true,
            name: "flag",
            optional: false,
        }));
        expected.parts.push(new XDescParam({
            allowedTypes: [ParamType.Number],
            expectsSep: false,
            name: "value",
            optional: false,
        }));
        expected.opts = 0;
        expected.effects.push(CommandEffectFactory.flagWrite());
        
        result.doc = TEST_DOC;
        expected.doc = TEST_DOC;

        assert.deepStrictEqual(result.effects.length, expected.effects.length);
        // TODO 
        result.effects.pop();
        expected.effects.pop();
        assert.deepStrictEqual(result, expected);
    });

    test("IF", () => {
        const result: XCommandDesc | null = XDescProvider.getCommandDesc("IF")!;
        const expected: XCommandDesc = new XCommandDesc;
        expected.parts.push(new XDescParam({
            allowedTypes: [ParamType.Player],
            expectsSep: true,
            name: "player",
            optional: false,
        }));
        expected.parts.push(new XDescParam({
            allowedTypes: [ParamType.ReadVar,ParamType.SetVar],
            expectsSep: false,
            name: "leftB",
            optional: false,
        }));
        expected.parts.push(new XDescParam({
            allowedTypes: [ParamType.CompareOperator],
            expectsSep: false,
            name: "operator",
            optional: false,
        }));
        expected.parts.push(new XDescParam({
            allowedTypes: [ParamType.Number, ParamType.Player],
            expectsSep: true,
            name: "rightA",
            optional: false,
        }));
        expected.parts.push(new XDescParam({
            allowedTypes: [ParamType.ReadVar,ParamType.SetVar],
            expectsSep: false,
            name: "rightB",
            optional: true,
        }));
        expected.opts = 1;
        expected.effects.push(CommandEffectFactory.conditionPush());
        
        result.doc = TEST_DOC;
        expected.doc = TEST_DOC;

        assert.deepStrictEqual(result.effects.length, expected.effects.length);
        // TODO 
        result.effects.pop();
        expected.effects.pop();
        assert.deepStrictEqual(result, expected);
    });
});