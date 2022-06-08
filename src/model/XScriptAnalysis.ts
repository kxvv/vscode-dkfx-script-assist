import { XWord } from "../interpreter/model/XWord";
import { ErrorCannotReuse, ErrorNothingToReuse, ErrorUnexpectedConditionEnd, ErrorUnexpectedConditionOpen, XError } from "../interpreter/model/XError";
import { XExp2 } from "../interpreter/model/XExp2";
import { VariableStorage } from "../VariableStorage";
import { DkDiag } from "./DkDiag";
import { ErrSeverity } from "./ErrSeverity";
import { RootLvl } from "./RootLvl";
import { XCommandDesc } from "./XCommandDesc";
import { CommandEffect } from "./XCommandEffect";
import { CONSTRAINTS } from "../TypeTools";


interface StackOpening {
    line: number;
    exp: XExp2 | XWord;
}

export class XScriptAnalysis {
    diags: DkDiag[] = [];
    conditionOpenings: StackOpening[] = [];
    reuses: StackOpening[] = [];
    diagIgnoreLines: number[] = [];
    private variableStorage = new VariableStorage;

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

            effects.timerWrite && this.evalTimers(line, exp, true, effects.timerWrite);
            effects.timerRead && this.evalTimers(line, exp, false, effects.timerRead);
            effects.flagWrite && this.evalFlags(line, exp, true, effects.flagWrite);
            effects.flagRead && this.evalFlags(line, exp, false, effects.flagRead);

            if (effects.apRead != null) {
                variable = exp.getChildsWord(effects.apRead);
                if (variable) {
                    this.variableStorage.pushApAlter(false, line, variable);
                }
            }
            if (effects.apWrite != null) {
                variable = exp.getChildsWord(effects.apWrite);
                if (variable) {
                    this.variableStorage.pushApAlter(true, line, variable);
                }
            }

            if (effects.msgSlot != null) {
                variable = exp.getChildsWord(effects.msgSlot);
                if (variable) {
                    this.variableStorage.pushMsgSlot(line, variable);
                }
            }

            if (effects.wins) {
                this.variableStorage.pushWin(line, exp.caller);
            }

            // eval parties

            if (effects.partyAdd != null) {
                variable = exp.getChildsWord(effects.partyAdd);
                if (variable) {
                    this.variableStorage.pushParty(variable.val, "add", line, exp);
                }
            }
            if (effects.partyRead != null) {
                variable = exp.getChildsWord(effects.partyRead);
                if (variable) {
                    this.variableStorage.pushParty(variable.val, "read", line, exp);
                }
            }
            if (effects.partyDelete != null) {
                variable = exp.getChildsWord(effects.partyDelete);
                if (variable) {
                    this.variableStorage.pushParty(variable.val, "del", line, exp);
                }
            }
        }
    }

    private evalTimers(line: number, exp: XExp2, write: boolean, indices: number[]) {
        for (const idx of indices) {
            const player: XWord | null = exp.getChildsWord(idx - 1);
            const variable: XWord | null = exp.getChildsWord(idx);
            if (player && variable) {
                this.variableStorage.pushTimerAlter(
                    player.val.toUpperCase(),
                    variable.val.toUpperCase(),
                    write,
                    line,
                    variable
                );
            }
        }
    }

    private evalFlags(line: number, exp: XExp2, write: boolean, indices: number[]) {
        for (const idx of indices) {
            const player: XWord | null = exp.getChildsWord(idx - 1);
            const variable: XWord | null = exp.getChildsWord(idx);
            if (player && variable) {
                this.variableStorage.pushFlagAlter(
                    player.val.toUpperCase(),
                    variable.val.toUpperCase(),
                    write,
                    line,
                    variable
                );
            }
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

    getNextFreeMsgNumber(): number | null {
        return this.variableStorage.getNextFreeMsgNumber();
    }

    isPartyDeclared(partyName: string): boolean {
        return this.variableStorage.isPartyDeclared(partyName);
    }

    getDeclaredPartyNames(): string[] {
        return this.variableStorage.getDeclaredPartyNames();
    }

    finalize() {
        for (const opn of this.conditionOpenings) {
            this.pushError(opn.line, new ErrorUnexpectedConditionOpen(opn.exp));
        }
        for (const reuse of this.reuses) {
            this.pushError(reuse.line, new ErrorNothingToReuse(reuse.exp));
        }
        this.variableStorage.finalize(this.pushError.bind(this));
    }
}