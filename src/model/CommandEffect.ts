import { LoadedCommand } from "./LoadedCommand";

export interface CommandEffect {
    conditionPush?: boolean;
    conditionPop?: boolean;
    reuses?: boolean;

    // vars:
    wins?: boolean;
    timerWrite?: number[];
    timerRead?: number[];
    flagWrite?: number[];
    flagRead?: number[];
    apWrite?: number;
    apRead?: number;
    partyCreate?: number;
    partyAdd?: number;
    partyRead?: number;
    partyDelete?: number;
    msgSlot?: number;
    versions?: boolean;
    tempTrap?: number;
    tempObject?: number;
    tempRoom?: number;
    tempCreature?: number;
}

export class CommandEffectFactory {
    public static fromLoadedCmd(loadCmd: LoadedCommand): CommandEffect {
        const eff: CommandEffect = {};
        (loadCmd.condition === "PUSH" && (eff.conditionPush = true));
        (loadCmd.condition === "POP" && (eff.conditionPop = true));
        (loadCmd.timerWriteAt && (eff.timerWrite = loadCmd.timerWriteAt));
        (loadCmd.timerReadAt && (eff.timerRead = loadCmd.timerReadAt));
        (loadCmd.flagWriteAt && (eff.flagWrite = loadCmd.flagWriteAt));
        (loadCmd.flagReadAt && (eff.flagRead = loadCmd.flagReadAt));
        (loadCmd.apWriteAt != null && (eff.apWrite = loadCmd.apWriteAt));
        (loadCmd.apReadAt != null && (eff.apRead = loadCmd.apReadAt));
        (loadCmd.partyAddAt != null && (eff.partyAdd = loadCmd.partyAddAt));
        (loadCmd.partyReadAt != null && (eff.partyRead = loadCmd.partyReadAt));
        (loadCmd.partyDeleteAt != null && (eff.partyDelete = loadCmd.partyDeleteAt));
        (loadCmd.wins != null && (eff.wins = loadCmd.wins));
        (loadCmd.reuses && (eff.reuses = true));
        (loadCmd.tempTrapAt != null && (eff.tempTrap = loadCmd.tempTrapAt));
        (loadCmd.tempObjectAt != null && (eff.tempObject = loadCmd.tempObjectAt));
        (loadCmd.tempRoomAt != null && (eff.tempRoom = loadCmd.tempRoomAt));
        (loadCmd.tempCreatureAt != null && (eff.tempCreature = loadCmd.tempCreatureAt));
        return eff;
    }
}