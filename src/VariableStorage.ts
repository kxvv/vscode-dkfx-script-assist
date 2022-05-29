import { DK_ENTITIES } from "./Entities";
import { XConst2 } from "./interpreter/model/XConst2";
import { XExp2 } from "./interpreter/model/XExp2";
import { XToken } from "./interpreter/model/XToken";
import { ParamType } from "./model/ParamType";

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
    };
    private timerAlters: {
        [key: string]: FlagTimerAlter[];
    };
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

    pushFlagAlter(player: string, flag: string, write: boolean, line: number, word: XToken | XConst2) {
        const varIndex = DK_ENTITIES[ParamType.Flag].findIndex(e => e.val === flag);
        if (varIndex !== -1) {
            let alter: FlagTimerAlter[] | undefined = this.flagAlters[this.playerColorToIndexedPlayer(player)];
            alter = alter || [];
            alter.push({
                varIndex,
                start: word.start,
                end: word.end,
                line,
                write,
            });
        }
    }

    pushTimerAlter(player: string, timer: string, write: boolean, line: number, word: XToken | XConst2) {
        const varIndex = DK_ENTITIES[ParamType.Timer].findIndex(e => e.val === timer);
        if (varIndex !== -1) {
            let alter: FlagTimerAlter[] | undefined = this.timerAlters[this.playerColorToIndexedPlayer(player)];
            alter = alter || [];
            alter.push({
                varIndex,
                start: word.start,
                end: word.end,
                line,
                write,
            });
        }
    }

    pushApAlter(reset: boolean, line: number, word: XToken | XConst2) {
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

    pushWin(line: number, word: XToken | XConst2) {
        this.winAlters.push({
            start: word.start,
            end: word.end,
            line,
        });
    }

    pushVersion(line: number, word: XToken | XConst2) {
        this.versionAlters.push({
            start: word.start,
            end: word.end,
            line,
        });
    }

    pushMsgSlot(line: number, word: XToken | XConst2) {
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
}