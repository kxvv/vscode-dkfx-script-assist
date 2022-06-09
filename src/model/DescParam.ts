import { ParamType } from "./ParamType";

export interface DescParam {
    allowedTypes: ParamType[];
    name: string;
    optional: boolean;
    preSep: boolean;
}
