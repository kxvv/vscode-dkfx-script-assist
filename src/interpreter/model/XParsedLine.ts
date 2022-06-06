import { XWord } from "./XConst2";
import { XError } from "./XError";
import { XExp2 } from "./XExp2";
import { XToken } from "./XToken";

export class XParsedLine2 {
    exp?: XExp2 | XWord;
    parseErrs?: XError[];
    comment?: XToken;

    pushError(err: XError) {
        this.parseErrs = this.parseErrs || [];
        this.parseErrs.push(err);
    }
}
