import { ParamType } from "./ParamType";
import { RootLvl } from "./RootLvl";
import { XSignChange } from "./SignChange";
import { CommandEffect } from "./XCommandEffect";
import { XDescParam } from "./XDescParam";

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
