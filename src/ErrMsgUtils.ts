import { ErrMsg } from "./model/ErrMsg";
import { ParamType } from "./model/ParamType";
import { CONSTRAINTS } from "./TypeUtils";

export class ErrMsgUtils {
    static getTypeMismatchMsg(allowedTypes: string[], val: string) {
        if (allowedTypes.length === 1 && allowedTypes[0] === ParamType.Party) {
            return ErrMsgUtils.getUnknownPartyMsg(val);
        }
        return ErrMsg.TypeMismatch
            .replace("$1", val)
            .replace("$2", allowedTypes.join("/"));
    }

    static getExtraParamsMsg(paramsLen: number) {
        return ErrMsg.TypeExtraParams.replace("$1", "" + paramsLen);
    }

    static getMissingParamsMsg(minParamsLen: number, maxParamsLen?: number) {
        if (minParamsLen === maxParamsLen || maxParamsLen == null) {
            return ErrMsg.TypeMissingParams.replace("$1-$2", "" + minParamsLen);
        }
        return ErrMsg.TypeMissingParams.replace("$1", "" + minParamsLen).replace("$2", "" + maxParamsLen);
    }

    static getDuplicatePartyDeclaration(partyName: string) {
        return ErrMsg.DuplicatePartyDeclaration.replace("$1", partyName);
    }

    static getUnknownCommandMsg(cmdName: string) {
        return ErrMsg.UnknownCommand + ": " + cmdName;
    }

    static getUnknownPartyMsg(partyName: string) {
        return ErrMsg.UnknownParty.replace("$1", partyName);
    }

    static getUsingBrackets(cmdName: string) {
        return ErrMsg.UsingBrackets.replace("$1", cmdName);
    }

    static getMsgNumberNotInRange() {
        return ErrMsg.MsgSlotNotInRange
            .replace("$1", String(CONSTRAINTS.minMsgNumber))
            .replace("$2", String(CONSTRAINTS.maxMsgNumber));
    }

    static getTooManyPartyMembers(maxNumber: number) {
        return ErrMsg.PartyTooManyMembers.replace("$1", "" + maxNumber);
    }

    static getPartyEmpty(partyName: string) {
        return ErrMsg.PartyEmpty.replace("$1", partyName);
    }

    static getPartyUnused(partyName: string) {
        return ErrMsg.PartyUnused.replace("$1", partyName);
    }
}
