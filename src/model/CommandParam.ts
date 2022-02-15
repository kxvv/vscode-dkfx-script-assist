import { ParamType } from "./ParamType";

export interface CommandParam {
    allowedTypes: ParamType[];
    name?: string;
    optional?: boolean;
}
