import { Entities } from "./Entities";
import { ErrorApNeverTriggered, ErrorFlagNeverRead, ErrorFlagNeverSet, ErrorMsgSlotUsed, ErrorNeverAddedToLevel, ErrorNoVersionCommand, ErrorNoWinCommand, ErrorPartyEmpty, ErrorPartyTooManyMembers, ErrorTimerNeverRead, ErrorTimerNeverSet, ErrorVersionAlreadySet } from "./model/DKError";
import { Exp } from "./model/Exp";
import { ScriptAnalysis } from "./model/ScriptAnalysis";
import { Token } from "./model/Token";
import { Word } from "./model/Word";
import { CONSTRAINTS, TypeTools } from "./TypeTools";

interface FlagTimerAlter {
    varIndex: number;
    line: number;
    start: number;
    end: number;
    write: boolean;
}

interface GeneralVarAlter {
    line: number;
    start: number;
    end: number;
}

interface ApAlter {
    number: number;
    line: number;
    start: number;
    end: number;
    reset: boolean;
}

interface Party {
    declareExp: {
        line: number;
        exp: Exp;
    }[];
    adds: {
        line: number;
        exp: Exp;
    }[];
    reads: number;
    dels: number;
}

export class VariableStorage {
    private flagAlters: {
        [key: string]: FlagTimerAlter[];
    } = {};
    private timerAlters: {
        [key: string]: FlagTimerAlter[];
    } = {};
    private apAlters: ApAlter[] = [];
    private winCount: number = 0;
    private versionAlters: GeneralVarAlter[] = [];
    private msgSlotAlters: GeneralVarAlter[][] = [];
    private parties: {
        [name: string]: Party;
    } = {};
    private tempTraps: string[] = [];

    pushParty(partyName: string, action: "create" | "add" | "read" | "del", line: number, exp: Exp) {
        if (!this.parties[partyName]) {
            this.parties[partyName] = {
                adds: [],
                declareExp: [{ line, exp }],
                dels: 0,
                reads: 0,
            };
        } else {
            this.parties[partyName].declareExp.push({ line, exp });
        }
        if (action === "add") { // add_to_party
            this.parties[partyName].adds.push({ exp, line });
        } else if (action === "read") { // add_party_to_level
            this.parties[partyName].reads++;
        } else if (action === "del") { // remove_from_party
            this.parties[partyName].dels++;
        }
    }

    pushFlagAlter(player: string, flag: string, write: boolean, line: number, word: Token | Word) {
        const varIndex = Entities.findFlagIndex(flag);
        const id = TypeTools.playerColorToIndexedPlayer(player);
        if (varIndex !== -1) {
            this.flagAlters[id] = this.flagAlters[id] || [];
            this.flagAlters[id].push({
                varIndex,
                start: word.start,
                end: word.end,
                line,
                write,
            });
        }
    }

    pushTimerAlter(player: string, timer: string, write: boolean, line: number, word: Token | Word) {
        const varIndex = Entities.findTimerIndex(timer);
        const id = TypeTools.playerColorToIndexedPlayer(player);
        if (varIndex !== -1) {
            this.timerAlters[id] = this.timerAlters[id] || [];
            this.timerAlters[id].push({
                varIndex,
                start: word.start,
                end: word.end,
                line,
                write,
            });
        }
    }

    pushApAlter(reset: boolean, line: number, word: Token | Word) {
        const num = +word.val;
        if (!isNaN(num)) {
            this.apAlters.push({
                start: word.start,
                end: word.end,
                line,
                number: num,
                reset,
            });
        }
    }

    pushWin() {
        this.winCount++;
    }

    pushVersion(line: number, exp: Exp | Word) {
        this.versionAlters.push({
            start: exp.start,
            end: exp.end,
            line,
        });
    }

    pushMsgSlot(line: number, word: Token | Word) {
        const slot = +word.val;
        if (!isNaN(slot)) {
            this.msgSlotAlters[slot] = this.msgSlotAlters[slot] || [];
            this.msgSlotAlters[slot].push({
                start: word.start,
                end: word.end,
                line,
            });
        }
    }

    getNextFreeMsgNumber(): number | null {
        for (let i = Math.max(CONSTRAINTS.minMsgNumber, 1); i <= CONSTRAINTS.maxMsgNumber; i++) {
            if (!this.msgSlotAlters[i]?.length) {
                return i;
            }
        }
        return null;
    }

    isPartyDeclared(partyName: string): boolean {
        return Object.keys(this.parties).map(name => name.toUpperCase()).includes(partyName.toUpperCase());
    }

    getDeclaredPartyNames(): string[] {
        return Object.keys(this.parties);
    }

    pushTempTrap(trapName: string) {
        this.tempTraps.push(trapName);
    }

    getTempTraps() {
        return this.tempTraps;
    }

    finalize(analysis: ScriptAnalysis) {
        for (const alters of Object.values(this.timerAlters)) {
            for (const alter of alters) {
                if (alter.write && !alters.find(a => a.varIndex === alter.varIndex && !a.write)) {
                    analysis.pushError(alter.line, new ErrorTimerNeverRead(alter));
                }
                if (!alter.write && !alters.find(a => a.varIndex === alter.varIndex && a.write)) {
                    analysis.pushError(alter.line, new ErrorTimerNeverSet(alter));
                }
            }
        }

        for (const alters of Object.values(this.flagAlters)) {
            for (const alter of alters) {
                if (alter.write && !alters.find(a => a.varIndex === alter.varIndex && !a.write)) {
                    analysis.pushError(alter.line, new ErrorFlagNeverRead(alter));
                }
                if (!alter.write && !alters.find(a => a.varIndex === alter.varIndex && a.write)) {
                    analysis.pushError(alter.line, new ErrorFlagNeverSet(alter));
                }
            }
        }

        for (const alter of this.apAlters) {
            if (alter.reset && !this.apAlters.find(a => !a.reset && a.number === alter.number)) {
                analysis.pushError(alter.line, new ErrorApNeverTriggered(alter));
            }
        }

        if (!this.winCount) {
            analysis.pushError(0, new ErrorNoWinCommand);
        }

        if (!this.versionAlters.length) {
            analysis.pushError(0, new ErrorNoVersionCommand);
        }
        for (const alter of this.versionAlters.slice(1)) {
            analysis.pushError(alter.line, new ErrorVersionAlreadySet(alter));
        }

        for (const indexedSlot of this.msgSlotAlters) {
            if (indexedSlot) {
                for (const slot of indexedSlot.slice(1)) {
                    analysis.pushError(slot.line, new ErrorMsgSlotUsed(slot));
                }
            }
        }

        let declareExp;
        for (const [name, val] of Object.entries(this.parties)) {
            if (declareExp = val.declareExp[0]) {
                if (!val.adds.length) {
                    analysis.pushError(declareExp.line, new ErrorPartyEmpty(name, declareExp.exp));
                }
                if (!val.reads) {
                    analysis.pushError(declareExp.line, new ErrorNeverAddedToLevel(name, declareExp.exp));
                }
                if (val.adds.length > CONSTRAINTS.maxPartyMembers && !val.dels) {
                    analysis.pushError(declareExp.line, new ErrorPartyTooManyMembers(name, declareExp.exp));
                }
            }
        }
    }
}