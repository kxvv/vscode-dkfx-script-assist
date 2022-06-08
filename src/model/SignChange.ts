import { DK_ENTITIES } from "../Entities";
import { XWord } from "../interpreter/model/XWord";
import { XExp2 } from "../interpreter/model/XExp2";
import { XExpChild } from "../interpreter/model/XExpChild";
import { TypeTools } from "../TypeTools";
import { ParamType } from "./ParamType";
import { XDescParam } from "./XDescParam";

export interface SignChange {
    check: "IN" | "EQ";
    in: number;
    out: number;
    arg?: string;
    typeArgs?: ParamType[];
    outTypes: ParamType[];
}

export enum SignOptChange {
    Required = "REQUIRED",
    Optional = "OPTIONAL",
}

interface IXSignChange {
    check: "IN" | "EQ";
    in: number;
    out: number;
    arg?: string;
    typeArgs?: ParamType[];
    change?: ParamType[];
    optChange?: SignOptChange;
}


export class XSignChange implements IXSignChange {
    check: "IN" | "EQ";
    in: number;
    out: number;
    change?: ParamType[];
    arg?: string;
    typeArgs?: ParamType[];
    optChange?: SignOptChange;

    constructor(arg: IXSignChange) {
        Object.assign(this, arg);
    }

    applySignParamsChange(exp: XExp2, paramsCopy: XDescParam[]): XDescParam[] {
        const comparedChild: XExpChild = exp.getChild(this.in);
        let willPerformChange = false;
        if (comparedChild) {
            const inValue = comparedChild.val;

            if (inValue instanceof XWord) {

                if (this.check === "EQ" && inValue.val === this.arg?.toUpperCase()) {
                    willPerformChange = true;
                } else if (this.check === "IN" && this.typeArgs) {
                    willPerformChange = this.typeArgs.some(t => TypeTools.utilFor(t).check({
                        word: inValue
                    }));
                }
                if (this.change && willPerformChange) {
                    paramsCopy[this.out] = {
                        ...paramsCopy[this.out],
                        allowedTypes: this.change
                    };
                }
                if (this.optChange && willPerformChange) {
                    paramsCopy[this.out] = {
                        ...paramsCopy[this.out],
                        optional: SignOptChange.Optional === this.optChange
                    };
                }

            } else {
                // TODO
            }
        }
        return paramsCopy;
    }
}
