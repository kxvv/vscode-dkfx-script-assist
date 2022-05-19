import { ParamType } from "./ParamType";

interface IXDescParam {
    allowedTypes: ParamType[];
    name: string;
    optional: boolean;
    expectsSep: boolean;
}

export class XDescParam implements IXDescParam {
    allowedTypes: ParamType[];
    name: string;
    optional: boolean;
    expectsSep: boolean;

    constructor(arg: IXDescParam) {
        Object.assign(this, arg);
    }
}
