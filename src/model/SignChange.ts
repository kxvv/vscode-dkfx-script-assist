import { ParamType } from "./ParamType";

export interface SignChange {
    check: "IN" | "EQ";
    in: number;
    out: number;
    arg?: string;
    typeArgs?: ParamType[];
    outTypes: ParamType[];
}