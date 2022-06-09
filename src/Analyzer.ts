import { DKError, ErrorArgumentsCount, ErrorCommandNotAtRootLvl, ErrorCommandOnlyAtRootLvl, ErrorEmptyParam, ErrorIncorrectOpeningToken, ErrorParensMismatch, ErrorReturnCommandAtRootLvl, ErrorReturnOnlyAsArg, ErrorSeparatorExpected, ErrorTypeMismatch, ErrorUnexpectedSeparator, ErrorUnknownCommand } from "./interpreter/model/DKError";
import { Exp } from "./interpreter/model/Exp";
import { ExpChild } from "./interpreter/model/ExpChild";
import { ParsedLine } from "./interpreter/model/ParsedLine";
import { XSyntaxToken } from "./interpreter/model/Token";
import { Word } from "./interpreter/model/Word";
import { CommandDesc } from "./model/CommandDesc";
import { CommandEffect } from "./model/CommandEffect";
import { DescParam } from "./model/DescParam";
import { Operator } from "./model/Operators";
import { ParamType } from "./model/ParamType";
import { RootLvl } from "./model/RootLvl";
import { ScriptAnalysis } from "./model/ScriptAnalysis";
import { LineMap } from "./ScriptInstance";
import { TypeTools } from "./TypeTools";

const DIAG_IGNORE_FLAG = "@ignore";

export class Analyzer {

    private static isWordCorrectType(
        line: number, word: Word, allowed: ParamType[], analysis: ScriptAnalysis
    ): boolean | DKError {
        let checkResult;
        for (const type of allowed) {
            if (checkResult = TypeTools.toolFor(type).check({ analysis, word, line })) {
                return checkResult;
            }
        }
        return false;
    }

    private static isCorrectReturnType(exp: Exp | Word, allowed: ParamType[]): boolean {
        const expDesc: CommandDesc | undefined = exp.getDesc();
        return !!(expDesc && allowed.some(t => expDesc.returns?.includes(t)));
    }

    private static checkParens(line: number, exp: Exp, desc: CommandDesc, analysis: ScriptAnalysis) {
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

    private static checkTypesForExp(line: number, exp: Exp, desc: CommandDesc, analysis: ScriptAnalysis) {
        const params: DescParam[] = desc.params;
        let misplacedParamsCount = 0;
        let child: ExpChild | undefined;
        let childVal: Exp | Word | null | undefined;
        let allowed: ParamType[];
        let optsCount = 0;
        let tempDesc: CommandDesc | undefined;
        let check: boolean | DKError;
        for (let i = 0; i < desc.params.length; i++) {
            child = exp.getChild(i);
            allowed = params[i].allowedTypes;
            optsCount += +params[i].optional;

            if (child) {
                childVal = child.val;

                if (childVal) {

                    if (childVal instanceof Word) {
                        if (
                            (check = Analyzer.isWordCorrectType(line, childVal, allowed, analysis)) !== true
                        ) {
                            if (!(tempDesc = childVal.getDesc()) || !Analyzer.isCorrectReturnType(childVal, allowed)) {
                                analysis.pushError(
                                    line,
                                    check === false
                                        ? new ErrorTypeMismatch(childVal, childVal.val, params[i].allowedTypes)
                                        : check
                                );
                            }
                            if (tempDesc = childVal.getDesc()) {
                                Analyzer.checkWordForParams(line, childVal, tempDesc, analysis);
                            }
                        }
                    } else {
                        if (!Analyzer.isCorrectReturnType(childVal, allowed)) {
                            analysis.pushError(
                                line,
                                new ErrorTypeMismatch(childVal.caller, childVal.caller.val, params[i].allowedTypes)
                            );
                        }
                        if (tempDesc = childVal.getDesc()) {
                            Analyzer.checkTypesForExp(line, childVal, tempDesc, analysis);
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
        Analyzer.checkParens(line, exp, desc, analysis);
        if (misplacedParamsCount) {
            analysis.pushError(line, new ErrorArgumentsCount(exp.caller, params.length - optsCount, params.length));
        }
        for (let i = desc.params.length; i < exp.getChildren().length; i++) {
            analysis.pushError(line, new ErrorArgumentsCount(exp.getChild(i), params.length - optsCount, params.length));
        }
    }

    private static checkForRootLvl(
        line: number, exp: Exp | Word, desc: CommandDesc, analysis: ScriptAnalysis
    ) {
        const isRoot = !analysis.conditionOpenings.length;
        if (isRoot && desc.rootLvl === RootLvl.Forbid) {
            analysis.pushError(line, new ErrorCommandNotAtRootLvl(exp));
        }
        if (!isRoot && desc.rootLvl === RootLvl.Enforce) {
            analysis.pushError(line, new ErrorCommandOnlyAtRootLvl(exp));
        }
        if (isRoot && desc.returns) {
            analysis.pushError(line, new ErrorReturnCommandAtRootLvl(exp));
        }
    }

    private static checkWordForParams(line: number, exp: Word, desc: CommandDesc, analysis: ScriptAnalysis) {
        if (desc.params.length) {
            const maxParams = desc.params.length;
            const requiredParams = maxParams - desc.params.filter(p => p.optional).length;
            analysis.pushError(line, new ErrorArgumentsCount(exp, requiredParams, maxParams));
        }
    }

    static analyze(lineMap: LineMap, lineCount?: number): ScriptAnalysis {
        const analysis: ScriptAnalysis = new ScriptAnalysis;

        let exp: Exp | Word | undefined;
        let line: ParsedLine | undefined;
        let desc: CommandDesc | undefined;
        let effects: CommandEffect | undefined;

        for (let i = 0; i < (lineCount || lineMap.length); i++) {
            if (line = lineMap[i]) {
                analysis.pushParseErrors(i, line.parseErrs);
                if (line.comment?.val.includes(DIAG_IGNORE_FLAG)) { analysis.pushDiagLineIgnore(i); }
                if (exp = line.exp) {
                    if (desc = exp.getDesc()) {
                        Analyzer.checkForRootLvl(i, exp, desc, analysis);
                        if (desc.returns) {
                            analysis.pushError(i, new ErrorReturnOnlyAsArg(exp));
                        }
                        if (exp instanceof Exp) {
                            Analyzer.checkTypesForExp(i, exp, desc, analysis);
                        } else {
                            Analyzer.checkWordForParams(i, exp, desc, analysis);
                        }
                        if (effects = desc.effects) {
                            analysis.evalEffects(i, exp, effects);
                        }
                    } else {
                        if (exp instanceof Exp) {
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