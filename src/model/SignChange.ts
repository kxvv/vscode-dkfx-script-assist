import { DK_ENTITIES } from "../Entities";
import { XConst2 } from "../interpreter/model/XConst2";
import { XExp2 } from "../interpreter/model/XExp2";
import { XExpChild } from "../interpreter/model/XExpChild";
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

interface IXSignChange {
    check: "IN" | "EQ";
    in: number;
    out: number;
    arg?: string;
    typeArgs?: ParamType[];
    change: ParamType[] | "MAKE_OPTIONAL"; // TODO
}


export class XSignChange implements IXSignChange {
    check: "IN" | "EQ";
    in: number;
    out: number;
    arg?: string;
    typeArgs?: ParamType[];
    change: ParamType[] | "MAKE_OPTIONAL"; // TODO

    constructor(arg: IXSignChange) {
        Object.assign(this, arg);
    }

    applySignParamsChange(exp: XExp2, paramsCopy: XDescParam[]): XDescParam[] {
        const targetChild: XExpChild = exp.getChildren()[this.in];
        let replace = false;
        if (targetChild) {
            const inValue = targetChild.val;

            if (inValue instanceof XConst2) {

                if (this.check === "EQ" && inValue.val === this.arg?.toUpperCase()) {
                    replace = true;
                } else if (this.check === "IN" && this.typeArgs) {
                    const targetEntitites = this.typeArgs.map(t => DK_ENTITIES[t]).flat().map(e => e.val);
                    replace = targetEntitites.includes(inValue.val);
                }
                if (replace) {
                    if (this.change === "MAKE_OPTIONAL") {
                        paramsCopy[this.out] = {
                            ...paramsCopy[this.out],
                            optional: true
                        };
                    } else {
                        paramsCopy[this.out] = {
                            ...paramsCopy[this.out],
                            allowedTypes: this.change
                        };
                    }
                }

            } else {
                // TODO
            }
        }
        return paramsCopy;
    }
}
