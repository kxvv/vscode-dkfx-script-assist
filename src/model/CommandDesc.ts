import { ParamType } from "./ParamType";
import { RootLvl } from "./RootLvl";
import { XSignChange } from "./SignChange";
import { CommandEffect } from "./CommandEffect";
import { DescParam } from "./DescParam";

export interface CommandDesc {
    params: DescParam[];
    bracketed: boolean;
    doc: string;
    autoTypes: boolean;
    signChanges?: XSignChange[];
    effects?: CommandEffect;
    rootLvl?: RootLvl;
    returns?: ParamType[];
}
