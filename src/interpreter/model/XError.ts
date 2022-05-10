import { TokenGroup } from "./TokenGroup";
import { XToken } from "./XToken";

export class XError {
    msg: string;
    start: number;
    end: number;

    constructor(msg: string, start: number, end: number) {
        this.msg = msg;
        this.start = start;
        this.end = end;
    }
}

export class ErrorInvalidStatement extends XError {
    constructor(token: XToken | TokenGroup) {
        super(`Invalid statement: script line must consist of a command or a comment`, token.start, token.end);
    }
}

export class ErrorUnexpectedOpeningToken extends XError {
    constructor(token: XToken | TokenGroup) {
        super(`Unexpected opening token`, token.start, token.end);
    }
}

export class ErrorOpeningAndClosingTokensMismatch extends XError {
    constructor(closer: XToken | TokenGroup) {
        super(`Opening and closing tokens do not match`, closer.start, closer.end);
    }
}

export class ErrorUnterminatedExpression extends XError {
    constructor(caller: XToken) {
        super(`Unterminated expression`, caller.start, caller.end);
    }
}

export class ErrorUnexpectedToken extends XError {
    constructor(token: XToken) {
        super(`Unexpected token: '${token.val}'`, token.start, token.end);
    }
}