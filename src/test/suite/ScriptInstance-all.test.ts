import * as assert from "assert";
import { Entities } from "../../Entities";
import { DkDiag } from "../../model/DkDiag";
import { ErrorApNeverTriggered, ErrorArgumentsCount, ErrorEmptyParam, ErrorFlagNeverSet, ErrorNothingToReuse, ErrorNoWinCommand, ErrorTypeMismatch, ErrorUndocumentedActionPoint, ErrorUndocumentedVariable, ErrorUnterminatedCondition } from "../../model/DKError";
import { ParamType } from "../../model/ParamType";
import { TestUtils } from "./TestUtils";

const script = `LEVEL_VERSION(1)
SET_FLAG(PLAYER2,FLAG9,FA)
SET_FLAG(RED,)
SET_FLAG

IF(BLUE,FLAG4>=120)
    RESET_ACTION_POINT(22)

NEXT_COMMAND_REUSABLE
`;

suite("ScriptInstance-all", () => {
    const instance = TestUtils.newScriptInstance(script);

    test("detect errors", () => {
        const diags = instance.collectDiagnostics();
        const expected: DkDiag[] = [
            {
                line: 1,
                ...new ErrorTypeMismatch({ start: 17, end: 22 }, "FLAG9", [ParamType.SetVar])
            },
            {
                line: 1,
                ...new ErrorTypeMismatch({ start: 23, end: 25 }, "FA", [ParamType.Number])
            },
            {
                line: 2,
                ...new ErrorEmptyParam({ start: 13, end: 13 })
            },
            {
                line: 2,
                ...new ErrorArgumentsCount({ start: 0, end: 8 }, 3, 3)
            },
            {
                line: 3,
                ...new ErrorArgumentsCount({ start: 0, end: 8 }, 3, 3)
            },
            {
                line: 5,
                ...new ErrorUndocumentedVariable({ start: 8, end: 13 }, ParamType.Flag)
            },
            {
                line: 6,
                ...new ErrorUndocumentedActionPoint({ start: 23, end: 25 })
            },
            {
                line: 5,
                ...new ErrorUnterminatedCondition({ start: 0, end: 19 })
            },
            {
                line: 8,
                ...new ErrorNothingToReuse({ start: 0, end: 21 })
            },
            {
                line: 5,
                ...new ErrorFlagNeverSet({ start: 8, end: 13 })
            },
            {
                line: 6,
                ...new ErrorApNeverTriggered({ start: 23, end: 25 })
            },
            {
                line: 0,
                ...new ErrorNoWinCommand()
            }
        ];
        assert.strictEqual(diags.length, expected.length);
        assert.deepStrictEqual(diags, expected);
    });

    test("suggest", () => {
        const suggs = instance.suggest(2, 13);
        const containsFlags = Entities.suggestForType(ParamType.Flag).every(s => {
            return !!suggs.find(sugg => sugg.label === s.label && sugg.documentation === s.documentation);
        });
        const containsCampFlags = Entities.suggestForType(ParamType.CampaignFlag).every(s => {
            return !!suggs.find(sugg => sugg.label === s.label && sugg.documentation === s.documentation);
        });
        assert.deepStrictEqual(true, containsFlags);
        assert.deepStrictEqual(true, containsCampFlags);
        assert.deepStrictEqual(true, suggs.some(sugg => sugg.label.startsWith("BOX0_ACTIVATED")));
    });

    test("hover", () => {
        const hover = instance.hover(5, 5);
        assert.deepStrictEqual(hover?.length, 2); // 2 hover info: one for command param, one for entity
    });

    test("hint", () => {
        // TODO
    });
});