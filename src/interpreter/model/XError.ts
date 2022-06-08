import { ErrSeverity } from "../../model/ErrSeverity";
import { ParamType } from "../../model/ParamType";
import { XToken } from "./XToken";

interface Range {
    start: number;
    end: number;
}

// if first line is marked with err/warn, use this range
const FIRST_LINE_RANGE = {
    start: 0,
    end: 64
};

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

export class ErrorTypeMismatch extends XError {
    constructor(exp: Range, value: string, pt: ParamType[]) {
        super(`Cannot assign '${value}' to ${pt.join("/")}`, exp.start, exp.end);
    }
}

export class ErrorEmptyParam extends XError {
    constructor(exp: Range) {
        super(`Empty params are not allowed`, exp.start, exp.end);
    }
}

export class ErrorArgumentsCount extends XError {
    constructor(exp: Range, min: number, max: number) {
        super(
            min === max ?
                `Expected ${min} param${min > 1 ? "s" : ""}`
                : `Expected ${min}-${max} params`, exp.start, exp.end
        );
    }
}

export class ErrorSeparatorExpected extends XError {
    constructor(exp: Range) {
        super(`Separator (',') expected`, exp.start, exp.end);
    }
}

export class ErrorUnexpectedSeparator extends XError {
    constructor(sep: Range) {
        super(`Unexpected separator`, sep.start, sep.end);
    }
}

export class ErrorReturnOnlyAsArg extends XError {
    constructor(exp: Range) {
        super(`Commands with return value can only be used as an argument`, exp.start, exp.end);
    }
}

export class ErrorParensMismatch extends XError {
    constructor(caller: Range) {
        super(`Opening and closing tokens do not match`, caller.start, caller.end);
    }
}

export class ErrorIncorrectOpeningToken extends XError {
    constructor(opener: Range, expected: string) {
        super(`Incorrect opening token (expected '${expected}')`, opener.start, opener.end);
    }
}

export class ErrorTimerNeverRead extends XError {
    constructor(timer: Range) {
        super(`Timer possibly never read`, timer.start, timer.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorTimerNeverSet extends XError {
    constructor(timer: Range) {
        super(`The timer might not have been set off`, timer.start, timer.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorFlagNeverRead extends XError {
    constructor(flag: Range) {
        super(`Flag is never read`, flag.start, flag.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorFlagNeverSet extends XError {
    constructor(flag: Range) {
        super(`The flag is possibly unset`, flag.start, flag.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorApNeverTriggered extends XError {
    constructor(flag: Range) {
        super(`Action point is never triggered`, flag.start, flag.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorNoWinCommand extends XError {
    constructor() {
        super(`No win command present in script`, FIRST_LINE_RANGE.start, FIRST_LINE_RANGE.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorNoVersionCommand extends XError {
    constructor() {
        super(`Level version not set. Use LEVEL_VERSION as the first command`, FIRST_LINE_RANGE.start, FIRST_LINE_RANGE.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorVersionAlreadySet extends XError {
    constructor(exp: Range) {
        super(`Level version has already been set`, exp.start, exp.end);
    }
}

export class ErrorMsgSlotUsed extends XError {
    constructor(slot: Range) {
        super(`Message number not unique`, slot.start, slot.end);
    }
}

export class ErrorPartyEmpty extends XError {
    constructor(name: string, party: Range) {
        super(`Party '${name}' is empty`, party.start, party.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorNeverAddedToLevel extends XError {
    constructor(name: string, party: Range) {
        super(`Party '${name}' is never added to the level`, party.start, party.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorPartyTooManyMembers extends XError {
    constructor(name: string, party: Range) {
        super(`Party '${name}' has too many members`, party.start, party.end);
        this.severity = ErrSeverity.Warning;
    }
}
