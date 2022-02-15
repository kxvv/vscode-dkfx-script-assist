import { EvalProps } from "./Analyzer";
import { ErrMsgUtils } from "./ErrMsgUtils";
import { CommandDesc } from "./model/CommandDesc";
import { DkDiag } from "./model/DkDiag";
import { ErrMsg } from "./model/ErrMsg";
import { ErrSeverity } from "./model/ErrSeverity";
import { Exp } from "./model/Exp";
import { ParamType } from "./model/ParamType";
import { RootLvl } from "./model/RootLvl";
import { ScriptAnalysis } from "./model/ScriptAnalysis";
import { CONSTRAINTS, DK_TYPES, TypeUtils } from "./TypeUtils";
import { Utils } from "./Utils";

const FIRST_LINE_DIAG_END = 64;
const MAX_PARTY_MEMBERS = 7;

export class AnalyzerUtils {
    static createSimpleDiag(e: Exp, line: number, msg: string): DkDiag {
        return {
            start: e.start,
            end: e.start + e.value.length,
            line,
            severity: ErrSeverity.Error,
            msg
        };
    };

    static diagVersionsAndWins(state: ScriptAnalysis) {
        if (!state.versionWrites.length) {
            state.diags.push({
                start: 0,
                end: FIRST_LINE_DIAG_END,
                line: 0,
                msg: ErrMsg.LvlVersionNotSet,
                severity: ErrSeverity.Information,
            });
        } else if (state.versionWrites.length > 1) {
            state.versionWrites.forEach(vw => {
                state.diags.push({
                    start: vw.start,
                    end: vw.end,
                    line: vw.line,
                    msg: ErrMsg.LvlVersionSetMultiple,
                    severity: ErrSeverity.Warning,
                });
            });
        }
        if (!state.winsCount) {
            state.diags.push({
                start: 0,
                end: FIRST_LINE_DIAG_END,
                line: 0,
                msg: ErrMsg.NoWinCommand,
                severity: ErrSeverity.Warning,
            });
        }
    }

    static diagAps(state: ScriptAnalysis) {
        state.apWrites
            .filter(apw => !state.apReads.some(apr => apw.varname === apr.varname))
            .forEach(tw => {
                state.diags.push({
                    start: tw.start,
                    end: tw.end,
                    line: tw.line,
                    msg: ErrMsg.ApNeverRead,
                    severity: ErrSeverity.Warning
                });
            });
    }

    static diagParties(state: ScriptAnalysis) {
        state.parties.forEach(p => {
            if ((p.adds.length - (p.dels || 0)) > MAX_PARTY_MEMBERS) {
                for (let i = p.adds.length - (p.dels || 0); i > MAX_PARTY_MEMBERS; i--) {
                    state.diags.push({
                        start: p.adds[i - 1].exp.start,
                        end: p.adds[i - 1].exp.end,
                        line: p.adds[i - 1].line,
                        msg: ErrMsgUtils.getTooManyPartyMembers(MAX_PARTY_MEMBERS),
                        severity: ErrSeverity.Warning
                    });
                }
            } else if (!p.adds.length && state.parties.filter(p2 => p2.name === p.name).length === 1) {
                state.diags.push({
                    start: p.declareExp.exp.start,
                    end: p.declareExp.exp.end,
                    line: p.declareExp.line,
                    msg: ErrMsgUtils.getPartyEmpty(p.name),
                    severity: ErrSeverity.Warning
                });
            }
        });
        state.parties.filter(p => !p.reads).forEach(p => {
            state.diags.push({
                start: p.declareExp.exp.start,
                end: p.declareExp.exp.end,
                line: p.declareExp.line,
                msg: ErrMsgUtils.getPartyUnused(p.name),
                severity: ErrSeverity.Warning
            });
        });
    }

    static isNonDecorable(desc: CommandDesc): boolean {
        if (desc.rootLvl === RootLvl.Enforce) {
            return true;
        }
        return [desc.isConditionPop, desc.isConditionPush, desc.decorates, desc.versionPutAt, desc.partyPutAt, desc.decorates]
            .some(prop => prop != null);
    }

    static diagTimers(state: ScriptAnalysis) {
        state.timerReads
            .filter(tr => !state.timerWrites.some(tw => tw.player === tr.player && tw.varname === tr.varname))
            .forEach(tr => {
                state.diags.push({
                    start: tr.start,
                    end: tr.end,
                    line: tr.line,
                    msg: ErrMsg.TimerNeverWritten,
                    severity: ErrSeverity.Warning
                });
            });
        state.timerWrites
            .filter(tw => !state.timerReads.some(tr => tw.player === tr.player && tw.varname === tr.varname))
            .forEach(tw => {
                state.diags.push({
                    start: tw.start,
                    end: tw.end,
                    line: tw.line,
                    msg: ErrMsg.TimerNeverRead,
                    severity: ErrSeverity.Warning
                });
            });
    }

    static diagFlags(state: ScriptAnalysis) {
        state.flagReads
            .filter(fr => !state.flagWrites.some(fw => fw.player === fr.player && fw.varname === fr.varname))
            .forEach(fr => {
                state.diags.push({
                    start: fr.start,
                    end: fr.end,
                    line: fr.line,
                    msg: ErrMsg.FlagNeverWritten,
                    severity: ErrSeverity.Warning
                });
            });
        state.flagWrites
            .filter(fw => !state.flagReads.some(fr => fw.player === fr.player && fw.varname === fr.varname))
            .forEach(fw => {
                state.diags.push({
                    start: fw.start,
                    end: fw.end,
                    line: fw.line,
                    msg: ErrMsg.FlagNeverRead,
                    severity: ErrSeverity.Warning
                });
            });
    }

    static diagMsgSlots(state: ScriptAnalysis) {
        Object.values(state.msgSlots)
            .filter(v => v.length > 1)
            .forEach(msgSlots => {
                state.diags.push(...msgSlots.map(slot => ({
                    start: slot.start,
                    end: slot.end,
                    line: slot.line,
                    msg: ErrMsg.MsgSlotNotUnique,
                    severity: ErrSeverity.Error
                })));
            });
        Object.keys(state.msgSlots)
            .filter(num => !Utils.isBetween(parseInt(num), CONSTRAINTS.minMsgNumber, CONSTRAINTS.maxMsgNumber))
            .forEach(num => {
                state.diags.push(...state.msgSlots[num].map(slot => ({
                    start: slot.start,
                    end: slot.end,
                    line: slot.line,
                    msg: ErrMsgUtils.getMsgNumberNotInRange(),
                    severity: ErrSeverity.Error
                })));
            });
    }

    static diagRootLvl(state: ScriptAnalysis, desc: CommandDesc, exp: Exp, line: number, inCondition: boolean) {
        if (desc.rootLvl === RootLvl.Enforce && inCondition) {
            state.diags.push({
                start: exp.start,
                end: exp.end,
                line,
                msg: ErrMsg.CommandOnlyAtRootLvl,
                severity: ErrSeverity.Error,
            });
        } else if (desc.rootLvl === RootLvl.Forbid && !inCondition) {
            state.diags.push({
                start: exp.start,
                end: exp.end,
                line,
                msg: ErrMsg.CommandNotAtRootLvl,
                severity: ErrSeverity.Error,
            });
        }
    }

    static evalParties({ exp, desc, line, state }: EvalProps) {
        if (desc.partyPutAt != null) {
            const newPartyName = exp.args[desc.partyPutAt]?.value;
            if (exp.args[desc.partyPutAt].args.length) {
                state.diags.push({
                    start: exp.args[desc.partyPutAt].start,
                    end: exp.args[desc.partyPutAt].end,
                    line,
                    severity: ErrSeverity.Error,
                    msg: ErrMsg.ComputedParamsNotAllowed
                });
            } else if (newPartyName) {
                if (state.parties.some(p => p.name === newPartyName)) {
                    state.diags.push({
                        start: exp.args[desc.partyPutAt].start,
                        end: exp.args[desc.partyPutAt].end,
                        line,
                        msg: ErrMsgUtils.getDuplicatePartyDeclaration(newPartyName),
                        severity: ErrSeverity.Error
                    });
                } else {
                    state.parties.push({
                        declareExp: { exp, line },
                        name: newPartyName,
                        adds: [],
                        reads: 0,
                        dels: 0,
                    });
                }
            }
        }
        if (desc.partyReadAt != null) {
            const partyName = exp.args[desc.partyReadAt]?.value;
            if (partyName) {
                state.parties.filter(p => p.name === partyName)
                    .forEach(p => p.reads++);
            }
        }
        if (desc.partyDeleteAt != null) {
            const partyName = exp.args[desc.partyDeleteAt]?.value;
            if (partyName) {
                state.parties.filter(p => p.name === partyName)
                    .forEach(p => p.dels++);
            }
        }
        if (desc.partyAddAt != null) {
            const targetPartyName = exp.args[desc.partyAddAt]?.value;
            if (targetPartyName) {
                const targetParty = state.parties.filter(p => p.name === targetPartyName)[0];
                targetParty?.adds.push({ line, exp });
            }
        }
    }

    static evalOthers({ exp, desc, line, state }: EvalProps) {
        if (desc.versionPutAt != null) {
            state.versionWrites.push({
                start: exp.start,
                end: exp.end,
                line,
                player: "",
                varname: ""
            });
        }
        if (desc.wins) {
            state.winsCount++;
        }
        if (desc.msgSlotAt != null && exp.args[desc.msgSlotAt]) {
            const msgExp = exp.args[desc.msgSlotAt];
            if (!msgExp.args.length) {
                if (!state.msgSlots[msgExp.value]) { state.msgSlots[msgExp.value] = []; }
                state.msgSlots[msgExp.value].push({
                    start: msgExp.start,
                    end: msgExp.end,
                    line,
                });
            }
        }
    }

    static evalTimers({ exp, desc, line, state }: EvalProps) {
        if (desc.timerWriteAt) {
            let [playerParam, varParam] = [exp.args[desc.timerWriteAt[0]], exp.args[desc.timerWriteAt[1]]];
            if (playerParam?.args.length === 0 && varParam?.args.length === 0) {
                state.timerWrites.push({
                    line,
                    player: TypeUtils.playerColorToIndexedPlayer(playerParam.value),
                    varname: varParam.value.toUpperCase(),
                    start: varParam.start,
                    end: varParam.end,
                });
            }
        }
        if (desc.timerReadAt) {
            let playerParam = exp.args[desc.timerReadAt[0]];
            let varParam = exp.args[desc.timerReadAt[1]];
            if (varParam?.args[0] && desc.params[desc.timerReadAt[1]]?.allowedTypes.includes(ParamType.Comparison)) {
                if (DK_TYPES[ParamType.Timer].entities.includes(varParam.args[0].value.toUpperCase())) {
                    varParam = varParam.args[0];
                }
            }
            if (playerParam?.args.length === 0 && varParam?.args.length === 0) {
                state.timerReads.push({
                    line,
                    player: TypeUtils.playerColorToIndexedPlayer(playerParam.value),
                    varname: varParam.value.toUpperCase(),
                    start: varParam.start,
                    end: varParam.end,
                });
            }
        }
    }

    static evalAps({ exp, desc, line, state }: EvalProps) {
        if (desc.apWriteAt != null) {
            let varParam = exp.args[desc.apWriteAt];
            if (varParam?.args.length === 0) {
                state.apWrites.push({
                    line,
                    player: "",
                    varname: varParam.value.toUpperCase(),
                    start: varParam.start,
                    end: varParam.end,
                });
            }
        }
        if (desc.apReadAt != null) {
            let varParam = exp.args[desc.apReadAt];
            if (varParam?.args.length === 0) {
                state.apReads.push({
                    line,
                    player: "",
                    varname: varParam.value.toUpperCase(),
                    start: varParam.start,
                    end: varParam.end,
                });
            }
        }
    }

    static evalFlags({ exp, desc, line, state }: EvalProps) {
        if (desc.flagWriteAt) {
            let [playerParam, varParam] = [exp.args[desc.flagWriteAt[0]], exp.args[desc.flagWriteAt[1]]];
            if (
                playerParam?.args.length === 0
                && varParam?.args.length === 0
                && DK_TYPES[ParamType.Flag].entities.includes(varParam.value.toUpperCase())
            ) {
                state.flagWrites.push({
                    line,
                    player: TypeUtils.playerColorToIndexedPlayer(playerParam.value),
                    varname: varParam.value.toUpperCase(),
                    start: varParam.start,
                    end: varParam.end,
                });
            }
        }
        if (desc.flagReadAt) {
            let playerParam = exp.args[desc.flagReadAt[0]];
            let varParam = exp.args[desc.flagReadAt[1]];
            if (varParam?.args[0] && desc.params[desc.flagReadAt[1]]?.allowedTypes.includes(ParamType.Comparison)) {
                if (DK_TYPES[ParamType.Flag].entities.includes(varParam.args[0].value.toUpperCase())) {
                    varParam = varParam.args[0];
                }
            }
            if (
                playerParam?.args.length === 0
                && varParam?.args.length === 0
                && DK_TYPES[ParamType.Flag].entities.includes(varParam.value.toUpperCase())
            ) {
                state.flagReads.push({
                    line,
                    player: TypeUtils.playerColorToIndexedPlayer(playerParam.value),
                    varname: varParam.value.toUpperCase(),
                    start: varParam.start,
                    end: varParam.end,
                });
            }
        }
    }
}