import { XExp2 } from "../interpreter/model/XExp2";
import { XSyntaxToken } from "../interpreter/model/XToken";
import { ParamType } from "./ParamType";
import { RootLvl } from "./RootLvl";
import { SignChange, XSignChange } from "./SignChange";
import { CommandEffect } from "./XCommandEffect";
import { XDescParam } from "./XDescParam";

// export interface CommandEffects {
//     isConditionPush?: boolean;
//     isConditionPop?: boolean;
//     partyPutAt?: number;
//     timerWriteAt?: [number, number];
//     timerReadAt?: [number, number];
//     flagReadAt?: [number, number];
//     flagWriteAt?: [number, number];
//     apReadAt?: number;
//     apWriteAt?: number;
//     msgSlotAt?: number;
//     versionPutAt?: number;
//     autoTypes?: boolean;
//     signChanges?: SignChange[];
//     returns?: ParamType[];
//     decorates?: boolean;
//     rootLvl?: RootLvl;
//     wins?: boolean;
//     partyAddAt?: number;
//     partyReadAt?: number;
//     partyDeleteAt?: number;
// }

export interface XCommandDesc {
    params: XDescParam[];
    bracketed: boolean;
    doc: string;
    autoTypes: boolean;
    signChanges?: XSignChange[];
    effects?: CommandEffect;
    rootLvl?: RootLvl;
    returns?: ParamType[];
}
