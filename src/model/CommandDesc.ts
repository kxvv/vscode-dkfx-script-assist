import { CommandParam } from "./CommandParam";
import { ParamType } from "./ParamType";
import { RootLvl } from "./RootLvl";
import { SignChange } from "./SignChange";

export interface CommandDesc {
    params: CommandParam[];
    opts?: number;
    bracketed?: boolean;
    isConditionPush?: boolean;
    isConditionPop?: boolean;
    partyPutAt?: number;
    timerWriteAt?: [number, number];
    timerReadAt?: [number, number];
    flagReadAt?: [number, number];
    flagWriteAt?: [number, number];
    apReadAt?: number;
    apWriteAt?: number;
    msgSlotAt?: number;
    versionPutAt?: number;
    autoTypes?: boolean;
    signChanges?: SignChange[];
    returns?: ParamType[];
    doc?: string;
    decorates?: boolean;
    rootLvl?: RootLvl;
    wins?: boolean;
    partyAddAt?: number;
    partyReadAt?: number;
    partyDeleteAt?: number;
}
