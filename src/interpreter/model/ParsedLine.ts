import { DKError } from "./DKError";
import { Exp } from "./Exp";
import { Token } from "./Token";
import { Word } from "./Word";

export class ParsedLine {
    exp?: Exp | Word;
    parseErrs?: DKError[];
    comment?: Token;

    pushError(err: DKError) {
        this.parseErrs = this.parseErrs || [];
        this.parseErrs.push(err);
    }
}
