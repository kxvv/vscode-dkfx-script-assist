import { XToken } from "./XToken";
import { XError } from "./XError";
import { XExp } from "./XExp";

export class XParsedLine {
    exp?: XExp | XToken;
    parseErrs?: XError[];
    comment?: XToken;

    pushError(err: XError) {
        this.parseErrs = this.parseErrs || [];
        this.parseErrs.push(err);
    }
}
