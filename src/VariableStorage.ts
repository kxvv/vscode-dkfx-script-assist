import { DK_ENTITIES } from "./Entities";
import { XWord } from "./interpreter/model/XWord";
import { XExp2 } from "./interpreter/model/XExp2";
import { XToken } from "./interpreter/model/XToken";
import { ParamType } from "./model/ParamType";
import { ErrorApNeverTriggered, ErrorFlagNeverRead, ErrorFlagNeverSet, ErrorMsgSlotUsed, ErrorNeverAddedToLevel, ErrorNoVersionCommand, ErrorNoWinCommand, ErrorPartyEmpty, ErrorPartyTooManyMembers, ErrorTimerNeverRead, ErrorTimerNeverSet, ErrorVersionAlreadySet, XError } from "./interpreter/model/XError";
import { CONSTRAINTS } from "./TypeTools";

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
        exp: XExp2;
    }[];
    adds: {
        line: number;
        exp: XExp2;
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
    private winAlters: GeneralVarAlter[] = [];
    private versionAlters: GeneralVarAlter[] = [];
    private msgSlotAlters: GeneralVarAlter[][] = [];
    private parties: {
        [name: string]: Party;
    } = {};

    private playerColorToIndexedPlayer(value: string): string {
        switch (value) {
            case "RED":
                return "PLAYER0";
            case "BLUE":
                return "PLAYER1";
            case "GREEN":
                return "PLAYER2";
            case "YELLOW":
                return "PLAYER3";
            case "WHITE":
                return "PLAYER_GOOD";
        }
        return value;
    }

    pushParty(partyName: string, action: "add" | "read" | "del", line: number, exp: XExp2) {
        if (!this.parties[partyName]) {
            this.parties[partyName] = {
                adds: [],
                declareExp: [],
                dels: 0,
                reads: 0,
            };
        }
        if (action === "add") { // add_to_party
            this.parties[partyName].adds.push({ exp, line });
        } else if (action === "read") { // add_party_to_level
            this.parties[partyName].reads++;
        } else if (action === "del") { // remove_from_party
            this.parties[partyName].dels++;
        }
    }

    pushFlagAlter(player: string, flag: string, write: boolean, line: number, word: XToken | XWord) {
        const varIndex = DK_ENTITIES[ParamType.Flag].findIndex(e => e.val === flag);
        const id = this.playerColorToIndexedPlayer(player);
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
        console.log('pushingg', varIndex, this.flagAlters[id]);
    }

    pushTimerAlter(player: string, timer: string, write: boolean, line: number, word: XToken | XWord) {
        const varIndex = DK_ENTITIES[ParamType.Timer].findIndex(e => e.val === timer);
        const id = this.playerColorToIndexedPlayer(player);
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

    pushApAlter(reset: boolean, line: number, word: XToken | XWord) {
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

    pushWin(line: number, word: XToken | XWord) {
        this.winAlters.push({
            start: word.start,
            end: word.end,
            line,
        });
    }

    pushVersion(line: number, word: XToken | XWord) {
        this.versionAlters.push({
            start: word.start,
            end: word.end,
            line,
        });
    }

    pushMsgSlot(line: number, word: XToken | XWord) {
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
        for (let i = CONSTRAINTS.minMsgNumber; i <= CONSTRAINTS.maxMsgNumber; i++) {
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

    finalize(pushError: (line: number, err: XError) => any) {
        for (const alters of Object.values(this.timerAlters)) {
            for (const alter of alters) {
                if (alter.write && !alters.find(a => a.varIndex === alter.varIndex && !a.write)) {
                    pushError(alter.line, new ErrorTimerNeverRead(alter));
                }
                if (!alter.write && !alters.find(a => a.varIndex === alter.varIndex && a.write)) {
                    pushError(alter.line, new ErrorTimerNeverSet(alter));
                }
            }
        }

        for (const alters of Object.values(this.flagAlters)) {
            for (const alter of alters) {
                if (alter.write && !alters.find(a => a.varIndex === alter.varIndex && !a.write)) {
                    pushError(alter.line, new ErrorFlagNeverRead(alter));
                }
                if (!alter.write && !alters.find(a => a.varIndex === alter.varIndex && a.write)) {
                    pushError(alter.line, new ErrorFlagNeverSet(alter));
                }
            }
        }

        for (const alter of this.apAlters) {
            if (alter.reset && this.apAlters.find(a => !a.reset && a.number === alter.number)) {
                pushError(alter.line, new ErrorApNeverTriggered(alter));
            }
        }

        if (!this.winAlters.length) {
            pushError(0, new ErrorNoWinCommand);
        }

        if (!this.versionAlters.length) {
            pushError(0, new ErrorNoVersionCommand);
        }
        for (const alter of this.versionAlters.slice(1)) {
            pushError(alter.line, new ErrorVersionAlreadySet(alter));
        }

        for (const indexedSlot of this.msgSlotAlters) {
            if (indexedSlot) {
                for (const slot of indexedSlot.slice(1)) {
                    pushError(slot.line, new ErrorMsgSlotUsed(slot));
                }
            }
        }

        let declareExp;
        for (const [name, val] of Object.entries(this.parties)) {
            if (declareExp = val.declareExp[0]) {
                if (!val.adds.length) {
                    pushError(declareExp.line, new ErrorPartyEmpty(name, declareExp.exp));
                }
                if (!val.reads) {
                    pushError(declareExp.line, new ErrorNeverAddedToLevel(name, declareExp.exp));
                }
                if (val.adds.length > CONSTRAINTS.maxPartyMembers && !val.dels) {
                    pushError(declareExp.line, new ErrorPartyTooManyMembers(name, declareExp.exp));
                }
            }
        }
    }
}