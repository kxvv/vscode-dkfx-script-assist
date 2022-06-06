import { ParamType } from "./ParamType";

export interface XDescParam {
    allowedTypes: ParamType[];
    name: string;
    optional: boolean;
    preSep: boolean;
}
