import { XSyntaxToken } from "../interpreter/model/XToken";
import { Operator } from "./Operators";
import { ParamType } from "./ParamType";
import { RootLvl } from "./RootLvl";
import { SignChange } from "./SignChange";
import { XDescParam } from "./XDescParam";
import { XTempArg } from "./XTempArg";

/*
    TODO
    autoTypes?: boolean;
    signChanges?: SignChange[];
    returns?: ParamType[];
    decorates?: boolean;
*/

export type CommandEffect = (arg: XTempArg) => any;

export class CommandEffectFactory {

    static conditionPush(): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static conditionPop
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static timerWrite
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static timerRead
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static flagWrite
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static flagRead
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static apWrite
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static apRead
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static partyAdd
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static partyRead
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static partyDelete
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static wins
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static msgSlot
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }

    static version
        (): CommandEffect {
        return (arg: XTempArg) => {
            // TODO
        };
    }
}