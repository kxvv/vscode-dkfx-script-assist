import { AnalyzerUtils } from "./AnalyzerUtils";
import { DescProvider } from "./DescProvider";
import { ErrMsgUtils } from "./ErrMsgUtils";
import { CommandDesc } from "./model/CommandDesc";
import { DkDiag } from "./model/DkDiag";
import { ErrMsg } from "./model/ErrMsg";
import { ErrSeverity } from "./model/ErrSeverity";
import { Exp } from "./model/Exp";
import { ParamType } from "./model/ParamType";
import { ScriptAnalysis } from "./model/ScriptAnalysis";
import { Statement } from "./model/Statement";
import { LineMap } from "./ScriptInstance";
import { TestUtils } from "./test/suite/TestUtils";
import { SyntaxToken } from "./Tokenizer";
import { TypeUtils } from "./TypeUtils";
import { Utils } from "./Utils";

export interface EvalProps {
    exp: Exp,
    line: number,
    desc: CommandDesc,
    state: ScriptAnalysis
}

const DIAG_IGNORE_FLAG = "@ignore";

export class Analyzer {

    static collectOneLineParseErrors(exp: Exp, line: number): DkDiag[] {
        const result: DkDiag[] = (exp.parseErrors || []).map(pe => ({
            line,
            start: pe.start || exp.start,
            end: pe.end || exp.end,
            msg: pe.msg,
            severity: ErrSeverity.Error
        }));
        for (const arg of exp.args) {
            result.push(...Analyzer.collectOneLineParseErrors(arg, line));
        }
        return result;
    }

    static performDiags(state: ScriptAnalysis): void {
        AnalyzerUtils.diagTimers(state);
        AnalyzerUtils.diagFlags(state);
        AnalyzerUtils.diagMsgSlots(state);
        AnalyzerUtils.diagVersionsAndWins(state);
        AnalyzerUtils.diagAps(state);
        AnalyzerUtils.diagParties(state);
    }

    static evalExpSideEffects(ep: EvalProps): void {
        AnalyzerUtils.evalParties(ep);
        AnalyzerUtils.evalTimers(ep);
        AnalyzerUtils.evalFlags(ep);
        AnalyzerUtils.evalAps(ep);
        AnalyzerUtils.evalOthers(ep);
    }

    static evalExp({ exp, line, state, desc }: EvalProps): void {
        let unprovidedCount = 0;
        let arg: Exp;
        let argDesc: CommandDesc | null;
        let allowedTypes: ParamType[];
        for (let i = 0; i < desc.params.length; i++) {
            arg = exp.args[i];
            if (arg && arg.value) {
                allowedTypes = desc.params[i].allowedTypes;
                argDesc = DescProvider.getCommandDesc(arg);
                if (!argDesc || argDesc.autoTypes) {
                    argDesc = DescProvider.deriveCommandDesc(arg, allowedTypes);
                }
                if (argDesc?.params.length && arg.args.length) {
                    Analyzer.evalExp({
                        exp: arg,
                        desc: argDesc,
                        line,
                        state
                    });
                }
                TypeUtils.typeCheckParam({
                    parent: exp,
                    arg,
                    argDesc,
                    argIndex: i,
                    line,
                    parentDesc: desc,
                    state,
                });
            } else {
                unprovidedCount += desc.params[i].optional ? 0 : 1;
            }
        }
        if (unprovidedCount) {
            state.diags.push({
                start: exp.start,
                end: exp.start + exp.value.length,
                line,
                severity: ErrSeverity.Error,
                msg: ErrMsgUtils.getMissingParamsMsg(desc.params.length - (desc.opts || 0), desc.params.length)
            });
        } else if (exp.args.length > desc.params.length) {
            state.diags.push({
                start: exp.start,
                end: exp.start + exp.value.length,
                line,
                severity: ErrSeverity.Error,
                msg: ErrMsgUtils.getExtraParamsMsg(desc.params.length)
            });
        }
        if (desc.bracketed && exp.opens !== SyntaxToken.BOpen) {
            state.diags.push(AnalyzerUtils.createSimpleDiag(exp, line, ErrMsgUtils.getUsingBrackets(exp.value)));
        }
    }

    static analyze(lineMap: LineMap, lineCount?: number): ScriptAnalysis {
        return TestUtils.createScriptAnl();
        // const result: ScriptAnalysis = TestUtils.createScriptAnl();
        // const conditionDiagStack: DkDiag[] = [];
        // let exp: Exp | undefined;
        // let desc: CommandDesc | null;
        // let ep: EvalProps;
        // let decoLine = -1;
        // let decoExp: Exp | null = null;
        // for (let i = 0; i < (lineCount || lineMap.length); i++) {
        //     exp = lineMap[i]?.exp;
        //     if (exp) {
        //         desc = DescProvider.getCommandDesc(exp);
        //         if (desc) {
        //             if (decoExp && AnalyzerUtils.isNonDecorable(desc)) {
        //                 result.diags.push(AnalyzerUtils.createSimpleDiag(decoExp, decoLine, ErrMsg.NextCommandNonDecorable));
        //             }
        //             AnalyzerUtils.diagRootLvl(result, desc, exp, i, !!conditionDiagStack.length);
        //             if (desc.decorates) {
        //                 decoLine = i;
        //                 decoExp = exp;
        //             } else { decoExp = null; }
        //             if (desc.isConditionPush) {
        //                 conditionDiagStack.push(AnalyzerUtils.createSimpleDiag(exp, i, ErrMsg.UnterminatedCondition));
        //             } else if (desc.isConditionPop) {
        //                 if (conditionDiagStack.length) {
        //                     conditionDiagStack.pop();
        //                 } else {
        //                     result.diags.push(AnalyzerUtils.createSimpleDiag(exp, i, ErrMsg.UnexpectedEndif));
        //                 }
        //             }
        //             if (desc.returns) {
        //                 result.diags.push(AnalyzerUtils.createSimpleDiag(exp, i, ErrMsg.CmdNotAtRootLvl));
        //             } else {
        //                 ep = { exp, desc, line: i, state: result };
        //                 Analyzer.evalExpSideEffects(ep);
        //                 Analyzer.evalExp(ep);
        //             }
        //         } else {
        //             result.diags.push(AnalyzerUtils.createSimpleDiag(exp, i, ErrMsgUtils.getUnknownCommandMsg(exp.value)));
        //         }
        //         result.diags.push(...Analyzer.collectOneLineParseErrors(exp, i));
        //     }
        //     if (lineMap[i]?.comment?.includes(DIAG_IGNORE_FLAG)) {
        //         result.diagIgnoreLines.push(i);
        //     }
        // }
        // if (decoExp) { result.diags.push(AnalyzerUtils.createSimpleDiag(decoExp, decoLine, ErrMsg.TrailingDecorator)); }
        // Analyzer.performDiags(result);
        // result.diags = [...result.diags, ...conditionDiagStack];
        // return result;
    }

    static getParamTypesForPosition(statement: Statement, pos: number): ParamType[] {
        if (statement.exp) {
            const e = statement.exp;
            if (Utils.isBetween(pos, e.bgnPos, e.endPos)) {
                let iterated: Exp = e;
                let desc: CommandDesc | null = DescProvider.getCommandDesc(iterated);
                let result: ParamType[] = [];
                let found = true;
                while (found) {
                    found = false;
                    if (!desc) { break; }
                    for (let j = 0; j < iterated.args.length; j++) {
                        if (Utils.isBetween(pos, iterated.args[j].bgnPos, iterated.args[j].endPos)) {
                            result = desc.params[j]?.allowedTypes || [];
                            iterated = iterated.args[j];

                            desc = DescProvider.getCommandDesc(iterated);
                            if (!desc || desc.autoTypes) {
                                desc = DescProvider.deriveCommandDesc(iterated, result);
                            }

                            found = true;
                            break;
                        }
                    }
                }
                return result;
            }
        }
        return [];
    }
}