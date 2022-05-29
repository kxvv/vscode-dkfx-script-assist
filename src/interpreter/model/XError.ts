import { ErrSeverity } from "../../model/ErrSeverity";
import { TokenGroup } from "./TokenGroup";
import { XToken } from "./XToken";

interface Range {
    start: number;
    end: number;
}

export class XError {
    msg: string;
    start: number;
    end: number;
    severity: ErrSeverity;

    constructor(msg: string, start: number, end: number, severity: ErrSeverity = ErrSeverity.Error) {
        this.msg = msg;
        this.start = start;
        this.end = end;
        this.severity = severity;
    }
}

export class ErrorInvalidStatement extends XError {
    constructor(token: Range) {
        super(`Invalid statement: script line must consist of a command or a comment`, token.start, token.end);
    }
}

export class ErrorUnexpectedOpeningToken extends XError {
    constructor(token: Range) {
        super(`Unexpected opening token`, token.start, token.end);
    }
}

export class ErrorOpeningAndClosingTokensMismatch extends XError {
    constructor(closer: Range) {
        super(`Opening and closing tokens do not match`, closer.start, closer.end);
    }
}

export class ErrorUnterminatedExpression extends XError {
    constructor(caller: Range) {
        super(`Unterminated expression`, caller.start, caller.end);
    }
}

export class ErrorUnexpectedToken extends XError {
    constructor(token: XToken) {
        super(`Unexpected token: '${token.val}'`, token.start, token.end);
    }
}

export class ErrorCannotReuse extends XError {
    constructor(exp: Range) {
        super(`This command can not be made reusable`, exp.start, exp.end);
    }
}

export class ErrorUnexpectedConditionOpen extends XError {
    constructor(exp: Range) {
        super(`Unterminated condition`, exp.start, exp.end);
    }
}

export class ErrorUnexpectedConditionEnd extends XError {
    constructor(exp: Range) {
        super(`Unexpected condition end`, exp.start, exp.end);
    }
}

export class ErrorNothingToReuse extends XError {
    constructor(exp: Range) {
        super(`Missing command to reuse`, exp.start, exp.end);
    }
}

export class ErrorUnknownCommand extends XError {
    constructor(exp: Range, name: string) {
        super(`Unknown command '${name}'`, exp.start, exp.end);
    }
}
