import { XWord } from "./interpreter/model/XWord";
import { ErrorArgumentsCount, ErrorEmptyParam, ErrorIncorrectOpeningToken, ErrorParensMismatch, ErrorReturnOnlyAsArg, ErrorSeparatorExpected, ErrorTypeMismatch, ErrorUnexpectedSeparator, ErrorUnknownCommand } from "./interpreter/model/XError";
import { XExp2 } from "./interpreter/model/XExp2";
import { XExpChild } from "./interpreter/model/XExpChild";
import { XParsedLine2 } from "./interpreter/model/XParsedLine";
import { XSyntaxToken } from "./interpreter/model/XToken";
import { Operator } from "./model/Operators";
import { ParamType } from "./model/ParamType";
import { XCommandDesc } from "./model/XCommandDesc";
import { CommandEffect } from "./model/XCommandEffect";
import { XDescParam } from "./model/XDescParam";
import { XScriptAnalysis } from "./model/XScriptAnalysis";
import { LineMap } from "./ScriptInstance";
import { TypeTools } from "./TypeTools";

const DIAG_IGNORE_FLAG = "@ignore";

export class XAnalyzer {

    private static isWordCorrectType(line: number, word: XWord, allowed: ParamType[], analysis: XScriptAnalysis): boolean {
        return allowed.some(t => TypeTools.utilFor(t).check({ analysis, word, line }));
    }

    private static isCorrectReturnType(exp: XExp2 | XWord, allowed: ParamType[]): boolean {
        const expDesc: XCommandDesc | undefined = exp.getDesc();
        return !!(expDesc && allowed.some(t => expDesc.returns?.includes(t)));
    }

    private static checkParens(line: number, exp: XExp2, desc: XCommandDesc, analysis: XScriptAnalysis) {
        if (exp.caller.val !== Operator.Rng) {
            if (exp.closer) {
                const parens = exp.opener.val + exp.closer.val;
                if (parens !== "()" && parens !== "[]") {
                    analysis.pushError(line, new ErrorParensMismatch(exp.caller));
                }
            }
            if (desc.bracketed && exp.opener.val === XSyntaxToken.POpen) {
                analysis.pushError(line, new ErrorIncorrectOpeningToken(exp.opener, XSyntaxToken.BOpen));
            } else if (!desc.bracketed && exp.opener.val === XSyntaxToken.BOpen) {
                analysis.pushError(line, new ErrorIncorrectOpeningToken(exp.opener, XSyntaxToken.POpen));
            }
        }
    }

    private static checkTypesForExp(line: number, exp: XExp2, desc: XCommandDesc, analysis: XScriptAnalysis) {
        const params: XDescParam[] = desc.params;
        let misplacedParamsCount = 0;
        let child: XExpChild | undefined;
        let childVal: XExp2 | XWord | null | undefined;
        let allowed: ParamType[];
        let optsCount = 0;
        let tempDesc: XCommandDesc | undefined;
        for (let i = 0; i < desc.params.length; i++) {
            child = exp.getChild(i);
            allowed = params[i].allowedTypes;
            optsCount += +params[i].optional;

            if (child) {
                childVal = child.val;

                if (childVal) {

                    if (childVal instanceof XWord) {
                        if (!XAnalyzer.isWordCorrectType(line, childVal, allowed, analysis)) {
                            if (!(tempDesc = childVal.getDesc()) || !XAnalyzer.isCorrectReturnType(childVal, allowed)) {
                                analysis.pushError(line, new ErrorTypeMismatch(childVal, childVal.val, params[i].allowedTypes));
                            }
                            if (tempDesc = childVal.getDesc()) {
                                XAnalyzer.checkWordForParams(line, childVal, tempDesc, analysis);
                            }
                        }
                    } else {
                        if (!XAnalyzer.isCorrectReturnType(childVal, allowed)) {
                            analysis.pushError(line, new ErrorTypeMismatch(childVal.caller, childVal.caller.val, params[i].allowedTypes));
                        }
                        if (tempDesc = childVal.getDesc()) {
                            XAnalyzer.checkTypesForExp(line, childVal, tempDesc, analysis);
                        }
                    }

                } else {
                    analysis.pushError(line, new ErrorEmptyParam(child));
                }

                if (desc.params[i].preSep && !child.preSep) {
                    analysis.pushError(line, new ErrorSeparatorExpected(child));
                }
                if (!desc.params[i].preSep && child.preSep) {
                    analysis.pushError(line, new ErrorUnexpectedSeparator(child.preSep));
                }

            } else {
                if (!desc.params[i].optional) { misplacedParamsCount++; }
            }
        }
        XAnalyzer.checkParens(line, exp, desc, analysis);
        if (misplacedParamsCount) {
            analysis.pushError(line, new ErrorArgumentsCount(exp.caller, params.length - optsCount, params.length));
        }
        for (let i = desc.params.length; i < exp.getChildren().length; i++) {
            analysis.pushError(line, new ErrorArgumentsCount(exp.getChild(i), params.length - optsCount, params.length));
        }
    }

    private static checkWordForParams(line: number, exp: XWord, desc: XCommandDesc, analysis: XScriptAnalysis) {
        if (desc.params.length) {
            const maxParams = desc.params.length;
            const requiredParams = maxParams - desc.params.filter(p => p.optional).length;
            analysis.pushError(line, new ErrorArgumentsCount(exp, requiredParams, maxParams));
        }
    }

    static analyze(lineMap: LineMap, lineCount?: number): XScriptAnalysis {
        const analysis: XScriptAnalysis = new XScriptAnalysis;

        let exp: XExp2 | XWord | undefined;
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
                        if (desc.returns) {
                            analysis.pushError(i, new ErrorReturnOnlyAsArg(exp));
                        }
                        if (exp instanceof XExp2) {
                            XAnalyzer.checkTypesForExp(i, exp, desc, analysis);
                        } else {
                            XAnalyzer.checkWordForParams(i, exp, desc, analysis);
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