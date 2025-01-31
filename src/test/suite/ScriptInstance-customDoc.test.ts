import * as assert from "assert";
import { DkDiag } from "../../model/DkDiag";
import { ErrorEmptyParam, ErrorUndocumentedVariable } from "../../model/DKError";
import { ParamType } from "../../model/ParamType";
import { TestUtils } from "./TestUtils";

const script = `LEVEL_VERSION(1)
REM flags:
REM p0.0 doc1
REM player1,1 doc2
REM red,2 doc3

REM action points:
REM 33 doc4

REM hero gates:
REM -2 doc5
REM 3 do6

SET_FLAG(RED,FLAG0,1)
SET_FLAG(RED,FLAG1,1)
SET_FLAG(PLAYER0,FLAG2,1)
SET_FLAG(PLAYER0,FLAG0,1)
RESET_ACTION_POINT(33)
QUICK_INFORMATION(1,"X",)
IF(PLAYER0,FLAG0==1)
IF(PLAYER0,FLAG1==1)
IF(PLAYER0,FLAG2==1)
IF_ACTION_POINT(33,BLUE)
    WIN_GAME
ENDIF
ENDIF
ENDIF
ENDIF
`;

suite("ScriptInstance-customDoc", () => {
    const instance = TestUtils.newScriptInstance(script);

    test("detect errors", () => {
        const diags = instance.collectDiagnostics();
        const expected: DkDiag[] = [
            {
                line: 14,
                ...new ErrorUndocumentedVariable({ start: 13, end: 18 }, ParamType.Flag)
            },
            {
                line: 18,
                ...new ErrorEmptyParam({ start: 24, end: 24 })
            },
            // { should not be visible - was already displayed
            //     line: 20,
            //     ...new ErrorUndocumentedVariable({ start: 11, end: 16 }, ParamType.Flag)
            // },
        ];

        assert.deepStrictEqual(diags, expected);
    });

    test("suggest", () => {
        const suggs = instance.suggest(18, 24);
        const customDocPointsInSuggs = ["-2", "-3", "33"].every(customLbl => suggs.some(sugg => sugg.label === customLbl));
        assert.deepStrictEqual(true, customDocPointsInSuggs);
    });
});