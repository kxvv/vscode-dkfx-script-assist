import { XToken } from "./XToken";
import { XError } from "./XError";
import { XExp } from "./XExp";
import { XExp2 } from "./XExp2";
import { XConst2 } from "./XConst2";

export class XParsedLine {
    exp?: XExp | XToken;
    parseErrs?: XError[];
    comment?: XToken;

    pushError(err: XError) {
        this.parseErrs = this.parseErrs || [];
        this.parseErrs.push(err);
    }
}

export class XParsedLine2 {
    exp?: XExp2 | XConst2;
    parseErrs?: XError[];
    comment?: XToken;

    pushError(err: XError) {
        this.parseErrs = this.parseErrs || [];
        this.parseErrs.push(err);
    }
}
