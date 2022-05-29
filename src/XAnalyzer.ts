import { XConst2 } from "./interpreter/model/XConst2";
import { ErrorUnknownCommand } from "./interpreter/model/XError";
import { XExp2 } from "./interpreter/model/XExp2";
import { XParsedLine2 } from "./interpreter/model/XParsedLine";
import { XCommandDesc } from "./model/XCommandDesc";
import { CommandEffect } from "./model/XCommandEffect";
import { XScriptAnalysis } from "./model/XScriptAnalysis";

type XLineMap = (XParsedLine2 | undefined)[];

const DIAG_IGNORE_FLAG = "@ignore";

export class XAnalyzer {

    private static checkTypesForExp(exp: XExp2, analysis: XScriptAnalysis) {

    }

    static analyze(lineMap: XLineMap, lineCount?: number): XScriptAnalysis {
        const analysis: XScriptAnalysis = new XScriptAnalysis;

        let exp: XExp2 | XConst2 | undefined;
        let line: XParsedLine2 | undefined;
        let desc: XCommandDesc | undefined;
        let effects: CommandEffect | undefined;

        for (let i = 0; i < (lineCount || lineMap.length); i++) {
            if (line = lineMap[i]) {
                analysis.pushParseErrors(i, line.parseErrs);
                if (line.comment?.val.includes(DIAG_IGNORE_FLAG)) { analysis.pushDiagLineIgnore(i); }
                if (exp = line.exp) {
                    if (desc = exp.getDesc()) {
                        if (effects = desc.effects) {
                            analysis.evalEffects(i, exp, effects);
                        }
                        if (exp instanceof XExp2) {
                            this.checkTypesForExp(exp, analysis);
                        }
                    } else {
                        if (exp instanceof XExp2) {
                            analysis.pushError(i, new ErrorUnknownCommand(exp.caller, exp.caller.val));
                        } else {
                            analysis.pushError(i, new ErrorUnknownCommand(exp, exp.val));
                        }
                    }
                    analysis.tryReuse(i, exp, desc);
                }
            }
        }
        analysis.finalize();
        return analysis;
    }
}