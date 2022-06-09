import { DKError, ErrorCannotReuse, ErrorNothingToReuse, ErrorUnexpectedConditionEnd, ErrorUnexpectedConditionOpen } from "../interpreter/model/DKError";
import { Exp } from "../interpreter/model/Exp";
import { Word } from "../interpreter/model/Word";
import { VariableStorage } from "../VariableStorage";
import { CommandDesc } from "./CommandDesc";
import { CommandEffect } from "./CommandEffect";
import { DkDiag } from "./DkDiag";
import { RootLvl } from "./RootLvl";

interface StackOpening {
    line: number;
    exp: Exp | Word;
}

export class ScriptAnalysis {
    diags: DkDiag[] = [];
    conditionOpenings: StackOpening[] = [];

    reuses: StackOpening[] = [];
    lastReuse: Word | Exp;

    diagIgnoreLines: number[] = [];
    private variableStorage = new VariableStorage;

    pushError(line: number, err: DKError) {
        this.diags.push({
            line,
            ...err
        });
    }

    pushParseErrors(line: number, errs: DKError[] = []) {
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

    evalEffects(line: number, exp: Word | Exp, effects: CommandEffect) {
        effects.conditionPush && this.conditionOpenings.push({ line, exp });
        if (effects.conditionPop) {
            if (this.conditionOpenings.length) {
                this.conditionOpenings.pop();
            } else {
                this.pushError(line, new ErrorUnexpectedConditionEnd(exp));
            }
        }
        if (effects.reuses) {
            this.lastReuse = exp;
            if (this.reuses.length) {
                this.pushError(line, new ErrorCannotReuse(exp));
            } else {
                this.reuses.push({ line, exp });
            }
        }

        let player: Word | null;
        let variable: Word | null;

        if (exp instanceof Exp) {

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

        if (effects.wins) {
            this.variableStorage.pushWin();
        }
        if (effects.versions) {
            this.variableStorage.pushVersion(line, exp);
        }
    }

    private evalTimers(line: number, exp: Exp, write: boolean, indices: number[]) {
        for (const idx of indices) {
            const player: Word | null = exp.getChildsWord(idx - 1);
            const variable: Word | null = exp.getChildsWord(idx);
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

    private evalFlags(line: number, exp: Exp, write: boolean, indices: number[]) {
        for (const idx of indices) {
            const player: Word | null = exp.getChildsWord(idx - 1);
            const variable: Word | null = exp.getChildsWord(idx);
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

    tryReuse(line: number, exp: Exp | Word, desc?: CommandDesc) {
        if (exp === this.lastReuse) { return; }
        let error = false;
        let eff: CommandEffect | undefined;
        if (this.reuses.length) {
            this.reuses.pop();
            if (desc) {
                if (desc.rootLvl === RootLvl.Enforce) { error = true; }
                else if (eff = desc.effects) {
                    error = [eff.conditionPop, eff.conditionPush, eff.reuses, eff.versions, eff.partyAdd]
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
        this.variableStorage.finalize(this);
    }
}