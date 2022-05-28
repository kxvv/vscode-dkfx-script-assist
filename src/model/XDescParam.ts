import { ParamType } from "./ParamType";

interface IXDescParam {
    allowedTypes: ParamType[];
    name: string;
    optional: boolean;
    preSep: boolean;
}

export interface XDescParam {
    allowedTypes: ParamType[];
    name: string;
    optional: boolean;
    preSep: boolean;
}
