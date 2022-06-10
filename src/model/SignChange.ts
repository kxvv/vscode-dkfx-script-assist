import { Exp } from "../interpreter/model/Exp";
import { ExpChild } from "../interpreter/model/ExpChild";
import { Word } from "../interpreter/model/Word";
import { TypeTools } from "../TypeTools";
import { DescParam } from "./DescParam";
import { ParamType } from "./ParamType";

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

interface ISignChange {
    check: "IN" | "EQ";
    in: number;
    out: number;
    arg?: string;
    typeArgs?: ParamType[];
    change?: ParamType[];
    optChange?: SignOptChange;
}


export class SignChange implements ISignChange {
    check: "IN" | "EQ";
    in: number;
    out: number;
    change?: ParamType[];
    arg?: string;
    typeArgs?: ParamType[];
    optChange?: SignOptChange;

    constructor(arg: ISignChange) {
        Object.assign(this, arg);
    }

    applySignParamsChange(exp: Exp, paramsCopy: DescParam[]): DescParam[] {
        const comparedChild: ExpChild = exp.getChild(this.in);
        let willPerformChange = false;
        if (comparedChild) {
            const inValue = comparedChild.val;

            if (inValue instanceof Word) {

                if (this.check === "EQ" && inValue.val === this.arg?.toUpperCase()) {
                    willPerformChange = true;
                } else if (this.check === "IN" && this.typeArgs) {
                    willPerformChange = this.typeArgs.some(t => true === TypeTools.toolFor(t).check({
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
