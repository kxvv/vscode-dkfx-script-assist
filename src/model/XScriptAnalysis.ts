import { XWord } from "../interpreter/model/XConst2";
import { ErrorCannotReuse, ErrorNothingToReuse, ErrorUnexpectedConditionEnd, ErrorUnexpectedConditionOpen, XError } from "../interpreter/model/XError";
import { XExp2 } from "../interpreter/model/XExp2";
import { VariableStorage } from "../VariableStorage";
import { DkDiag } from "./DkDiag";
import { ErrSeverity } from "./ErrSeverity";
import { RootLvl } from "./RootLvl";
import { XCommandDesc } from "./XCommandDesc";
import { CommandEffect } from "./XCommandEffect";


interface StackOpening {
    line: number;
    exp: XExp2 | XWord;
}

export class XScriptAnalysis {
    diags: DkDiag[] = [];
    conditionOpenings: StackOpening[] = [];
    reuses: StackOpening[] = [];
    diagIgnoreLines: number[] = [];
    variableStorage = new VariableStorage;

    pushError(line: number, err: XError) {
        this.diags.push({
            line,
            ...err
        });
    }

    pushParseErrors(line: number, errs: XError[] = []) {
        for (const err of errs) {
            this.diags.push({
                line,
                ...err
            });
        }
    }

    pushDiagLineIgnore(line: number) {
        this.diagIgnoreLines.push(line);
    }

    evalEffects(line: number, exp: XWord | XExp2, effects: CommandEffect) {
        effects.conditionPush && this.conditionOpenings.push({ line, exp });
        if (effects.conditionPop) {
            if (this.conditionOpenings.length) {
                this.conditionOpenings.pop();
            } else {
                this.pushError(line, new ErrorUnexpectedConditionEnd(exp));
            }
        }
        if (effects.reuses) {
            if (this.reuses.length) {
                this.pushError(line, new ErrorCannotReuse(exp));
            } else {
                this.reuses.push({ line, exp });
            }
        }

        let player: XWord | null;
        let variable: XWord | null;

        if (exp instanceof XExp2) {

            // eval vars

            if (effects.timerWrite) {
                player = exp.getChildsConst(effects.timerWrite[0]);
                variable = exp.getChildsConst(effects.timerWrite[1]);
                if (player && variable) {
                    this.variableStorage.pushTimerAlter(
                        player.val.toUpperCase(),
                        variable.val.toUpperCase(),
                        true,
                        line,
                        variable
                    );
                }
            }
            if (effects.timerRead) {
                player = exp.getChildsConst(effects.timerRead[0]);
                variable = exp.getChildsConst(effects.timerRead[1]);
                if (player && variable) {
                    this.variableStorage.pushTimerAlter(
                        player.val.toUpperCase(),
                        variable.val.toUpperCase(),
                        false,
                        line,
                        variable
                    );
                }
            }

            if (effects.flagWrite) {
                player = exp.getChildsConst(effects.flagWrite[0]);
                variable = exp.getChildsConst(effects.flagWrite[1]);
                if (player && variable) {
                    this.variableStorage.pushTimerAlter(
                        player.val.toUpperCase(),
                        variable.val.toUpperCase(),
                        true,
                        line,
                        variable
                    );
                }
            }
            if (effects.flagRead) {
                player = exp.getChildsConst(effects.flagRead[0]);
                variable = exp.getChildsConst(effects.flagRead[1]);
                if (player && variable) {
                    this.variableStorage.pushTimerAlter(
                        player.val.toUpperCase(),
                        variable.val.toUpperCase(),
                        false,
                        line,
                        variable
                    );
                }
            }

            if (effects.apRead != null) {
                variable = exp.getChildsConst(effects.apRead);
                if (variable) {
                    this.variableStorage.pushApAlter(false, line, variable);
                }
            }
            if (effects.apWrite != null) {
                variable = exp.getChildsConst(effects.apWrite);
                if (variable) {
                    this.variableStorage.pushApAlter(true, line, variable);
                }
            }

            if (effects.msgSlot != null) {
                variable = exp.getChildsConst(effects.msgSlot);
                if (variable) {
                    this.variableStorage.pushMsgSlot(line, variable);
                }
            }

            if (effects.wins) {
                this.variableStorage.pushWin(line, exp.caller);
            }

            // eval parties
            // TODO
        }
    }

    tryReuse(line: number, exp: XExp2 | XWord, desc?: XCommandDesc) {
        let error = false;
        let eff: CommandEffect | undefined;
        if (this.reuses.length) {
            this.reuses.pop();
            if (desc) {
                if (desc.rootLvl === RootLvl.Enforce) { error = true; }
                else if (eff = desc.effects) {
                    error = [eff.conditionPop, eff.conditionPush, eff.reuses, eff.version, eff.partyAdd]
                        .some(e => e != null);
                }
            }
        }
        if (error) {
            this.pushError(line, new ErrorCannotReuse(exp));
        }
    }

    finalize() {
        for (const opn of this.conditionOpenings) {
            this.pushError(opn.line, new ErrorUnexpectedConditionOpen(opn.exp));
        }
        for (const reuse of this.reuses) {
            this.pushError(reuse.line, new ErrorNothingToReuse(reuse.exp));
        }
    }
}