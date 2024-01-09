import { ParamType } from "./ParamType";
import { RootLvl } from "./RootLvl";
import { SignChange } from "./SignChange";
import { CommandEffect } from "./CommandEffect";
import { DescParam } from "./DescParam";

export interface CommandDesc {
    params: DescParam[];
    bracketed: boolean;
    doc: string;
    autoTypes: boolean;
    signChanges?: SignChange[];
    effects?: CommandEffect;
    rootLvl?: RootLvl;
    returns?: ParamType[];
    deprecated?: boolean;
}
