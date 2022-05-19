import { XSyntaxToken } from "../interpreter/model/XToken";
import { Operator } from "./Operators";
import { ParamType } from "./ParamType";
import { RootLvl } from "./RootLvl";
import { SignChange } from "./SignChange";
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

export class XCommandDesc {
    parts: XDescParam[] = [];
    effects: CommandEffect[] = [];
    opts: number = 0;
    bracketed: boolean = false;
    doc: string = "";
    autoTypes: boolean = false;
}
