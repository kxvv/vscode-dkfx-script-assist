import { TypeTools } from "../TypeTools";
import { VariableStorage } from "../VariableStorage";
import { CommandDesc } from "./CommandDesc";
import { CommandEffect } from "./CommandEffect";
import { CustomDoc, CustomDocResult } from "./CustomDoc";
import { DkDiag } from "./DkDiag";
import { DKError, ErrorCannotReuse, ErrorNothingToReuse, ErrorUndocumentedActionPoint, ErrorUndocumentedHeroGate, ErrorUndocumentedVariable, ErrorUnexpectedConditionEnd, ErrorUnterminatedCondition } from "./DKError";
import { DkSuggestion } from "./DkSuggestion";
import { Exp } from "./Exp";
import { ParamType } from "./ParamType";
import { RootLvl } from "./RootLvl";
import { Word } from "./Word";

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
    private customDoc = new CustomDoc;

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
        let variableMulti: Word[];

        if (exp instanceof Exp) {

            // eval vars

            effects.timerWrite && this.evalTimers(line, exp, true, effects.timerWrite);
            effects.timerRead && this.evalTimers(line, exp, false, effects.timerRead);
            effects.flagWrite && this.evalFlags(line, exp, true, effects.flagWrite);
            effects.flagRead && this.evalFlags(line, exp, false, effects.flagRead);

            if (effects.apRead != null) {
                variableMulti = exp.getChildsWordNested(effects.apRead);
                for (const v of variableMulti) {
                    this.variableStorage.pushApAlter(false, line, v);
                }
            }
            if (effects.apWrite != null) {
                variableMulti = exp.getChildsWordNested(effects.apWrite);
                for (const v of variableMulti) {
                    this.variableStorage.pushApAlter(true, line, v);
                }
            }

            if (effects.msgSlot != null) {
                variable = exp.getChildsWord(effects.msgSlot);
                if (variable) {
                    this.variableStorage.pushMsgSlot(line, variable);
                }
            }

            // eval parties

            if (effects.partyCreate != null) {
                variable = exp.getChildsWord(effects.partyCreate);
                if (variable) {
                    this.variableStorage.pushParty(variable.val, "create", line, exp);
                }
            }
            if (effects.partyAdd != null) {
                variableMulti = exp.getChildsWordNested(effects.partyAdd);
                for (const v of variableMulti) {
                    this.variableStorage.pushParty(v.val, "add", line, exp);
                }
            }
            if (effects.partyRead != null) {
                variableMulti = exp.getChildsWordNested(effects.partyRead);
                for (const v of variableMulti) {
                    this.variableStorage.pushParty(v.val, "read", line, exp);
                }
            }
            if (effects.partyDelete != null) {
                variableMulti = exp.getChildsWordNested(effects.partyDelete);
                for (const v of variableMulti) {
                    this.variableStorage.pushParty(v.val, "del", line, exp);
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
            if (player) {
                const variableMulti: Word[] = exp.getChildsWordNested(idx);
                for (const v of variableMulti) {
                    this.variableStorage.pushTimerAlter(
                        player.val.toUpperCase(),
                        v.val.toUpperCase(),
                        write,
                        line,
                        v
                    );

                }
            }
        }
    }

    private evalFlags(line: number, exp: Exp, write: boolean, indices: number[]) {
        for (const idx of indices) {
            const player: Word | null = exp.getChildsWord(idx - 1);
            if (player) {
                const variableMulti: Word[] = exp.getChildsWordNested(idx);
                for (const v of variableMulti) {
                    this.variableStorage.pushFlagAlter(
                        player.val.toUpperCase(),
                        v.val.toUpperCase(),
                        write,
                        line,
                        v
                    );
                }
            }
        }
    }

    evalComment(comment: string | undefined, row: number): void {
        comment && this.customDoc.processComment(comment, row);
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
                    error = [eff.conditionPop, eff.conditionPush, eff.reuses, eff.versions]
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

    getCustomDoc(type: ParamType, varName: string, playerName?: string): CustomDocResult | null {
        return this.customDoc.getCustomDoc(type, varName, playerName);
    }

    suggestLocationsFromCustomDoc(type: ParamType) {
        return this.customDoc.suggestCustomDoc(type);
    }

    suggestFromCustomDoc(type: ParamType, entitySuggestions: DkSuggestion[], leafExp?: Exp | null, index?: number): DkSuggestion[] {
        let custom: DkSuggestion[] = [];
        if (leafExp != null && index != null) {
            const playerNameExpChild = leafExp.getChild(index - 1);
            if (playerNameExpChild?.val instanceof Word) {
                custom = this.customDoc.suggestCustomDoc(type, playerNameExpChild.val.val);
            }
        }
        if (custom.length) {
            const labelsOfSuggested = custom.map(c => c.label);
            return entitySuggestions.filter(es => !labelsOfSuggested.includes(es.label)).concat(custom);
        }
        return entitySuggestions;
    }

    checkForMissingCustomDoc(line: number, word: Word, type: ParamType) {
        // TODO: and if hinting is disabled in config
        if (!TypeTools.isTypeCustomDocumentable(type)) {
            return;
        }
        if (type === ParamType.ActionPoint) {
            if (!this.getCustomDoc(type, word.val)) {
                this.pushError(line, new ErrorUndocumentedActionPoint(word));
            }
        } else if (type === ParamType.HeroGate) {
            if (!this.getCustomDoc(type, word.val)) {
                this.pushError(line, new ErrorUndocumentedHeroGate(word));
            }
        } else {
            const sibling = word.parent?.getPreceedingSibling()?.val;
            if (sibling instanceof Word && word.parent?.parent.getDesc()?.returns == null) {
                if (!this.getCustomDoc(type, word.val, sibling.val)) {
                    this.pushError(line, new ErrorUndocumentedVariable(word, type));
                }
            }
        }
    }

    finalize() {
        for (const opn of this.conditionOpenings) {
            this.pushError(opn.line, new ErrorUnterminatedCondition(opn.exp));
        }
        for (const reuse of this.reuses) {
            this.pushError(reuse.line, new ErrorNothingToReuse(reuse.exp));
        }
        this.variableStorage.finalize(this);
    }
}