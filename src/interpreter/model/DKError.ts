import { ErrSeverity } from "../../model/ErrSeverity";
import { ParamType } from "../../model/ParamType";
import { Token } from "./Token";

interface Range {
    start: number;
    end: number;
}

// if first line is marked with err/warn, use this range
const FIRST_LINE_RANGE = {
    start: 0,
    end: 64
};

export class DKError {
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

export class ErrorInvalidStatement extends DKError {
    constructor(token: Range) {
        super(`Invalid commant syntax: script line must consist of a comment or a single command followed by a comment`, token.start, token.end);
    }
}

export class ErrorUnexpectedOpeningToken extends DKError {
    constructor(token: Range) {
        super(`Unexpected opening token`, token.start, token.end);
    }
}

export class ErrorOpeningAndClosingTokensMismatch extends DKError {
    constructor(closer: Range) {
        super(`Opening and closing tokens do not match`, closer.start, closer.end);
    }
}

export class ErrorUnterminatedExpression extends DKError {
    constructor(caller: Range) {
        super(`Unterminated expression`, caller.start, caller.end);
    }
}

export class ErrorUnexpectedToken extends DKError {
    constructor(token: Token) {
        super(`Unexpected token: '${token.val}'`, token.start, token.end);
    }
}

export class ErrorCannotReuse extends DKError {
    constructor(exp: Range) {
        super(`This command can not be made reusable`, exp.start, exp.end);
    }
}

export class ErrorUnexpectedConditionOpen extends DKError {
    constructor(exp: Range) {
        super(`Unterminated condition`, exp.start, exp.end);
    }
}

export class ErrorUnexpectedConditionEnd extends DKError {
    constructor(exp: Range) {
        super(`Unexpected condition end`, exp.start, exp.end);
    }
}

export class ErrorNothingToReuse extends DKError {
    constructor(exp: Range) {
        super(`Missing command to reuse`, exp.start, exp.end);
    }
}

export class ErrorUnknownCommand extends DKError {
    constructor(exp: Range, name: string) {
        super(`Unknown command '${name}'`, exp.start, exp.end);
    }
}

export class ErrorTypeMismatch extends DKError {
    constructor(exp: Range, value: string, pt: ParamType[]) {
        super(`Cannot assign '${value}' to ${pt.join("/")}`, exp.start, exp.end);
    }
}

export class ErrorEmptyParam extends DKError {
    constructor(exp: Range) {
        super(`Empty params are not allowed`, exp.start, exp.end);
    }
}

export class ErrorArgumentsCount extends DKError {
    constructor(exp: Range, min: number, max: number) {
        super(
            min === max ?
                `Expected ${min} param${min > 1 ? "s" : ""}`
                : `Expected ${min}-${max} params`, exp.start, exp.end
        );
    }
}

export class ErrorSeparatorExpected extends DKError {
    constructor(exp: Range) {
        super(`Separator (',') expected`, exp.start, exp.end);
    }
}

export class ErrorUnexpectedSeparator extends DKError {
    constructor(sep: Range) {
        super(`Unexpected separator`, sep.start, sep.end);
    }
}

export class ErrorReturnOnlyAsArg extends DKError {
    constructor(exp: Range) {
        super(`Commands with return value can only be used as an argument`, exp.start, exp.end);
    }
}

export class ErrorParensMismatch extends DKError {
    constructor(caller: Range) {
        super(`Opening and closing tokens do not match`, caller.start, caller.end);
    }
}

export class ErrorIncorrectOpeningToken extends DKError {
    constructor(opener: Range, expected: string) {
        super(`Incorrect opening token (expected '${expected}')`, opener.start, opener.end);
    }
}

export class ErrorTimerNeverRead extends DKError {
    constructor(timer: Range) {
        super(`Timer possibly never read`, timer.start, timer.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorTimerNeverSet extends DKError {
    constructor(timer: Range) {
        super(`The timer might not have been set off`, timer.start, timer.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorFlagNeverRead extends DKError {
    constructor(flag: Range) {
        super(`Flag is never read`, flag.start, flag.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorFlagNeverSet extends DKError {
    constructor(flag: Range) {
        super(`The flag is possibly unset`, flag.start, flag.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorApNeverTriggered extends DKError {
    constructor(flag: Range) {
        super(`Action point is never triggered`, flag.start, flag.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorNoWinCommand extends DKError {
    constructor() {
        super(`No win command present in script`, FIRST_LINE_RANGE.start, FIRST_LINE_RANGE.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorNoVersionCommand extends DKError {
    constructor() {
        super(`Level version not set. Use LEVEL_VERSION as the first command`, FIRST_LINE_RANGE.start, FIRST_LINE_RANGE.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorVersionAlreadySet extends DKError {
    constructor(exp: Range) {
        super(`Level version has already been set`, exp.start, exp.end);
    }
}

export class ErrorMsgSlotUsed extends DKError {
    constructor(slot: Range) {
        super(`Message number not unique`, slot.start, slot.end);
    }
}

export class ErrorMsgOutOfRange extends DKError {
    constructor(slot: Range, min: number, max: number) {
        super(`Message number out of range: ${min}-${max} allowed`, slot.start, slot.end);
    }
}

export class ErrorPartyEmpty extends DKError {
    constructor(name: string, party: Range) {
        super(`Party '${name}' is empty`, party.start, party.end);
    }
}

export class ErrorNeverAddedToLevel extends DKError {
    constructor(name: string, party: Range) {
        super(`Party '${name}' is never added to the level`, party.start, party.end);
        this.severity = ErrSeverity.Warning;
    }
}

export class ErrorPartyTooManyMembers extends DKError {
    constructor(name: string, party: Range) {
        super(`Party '${name}' has too many members`, party.start, party.end);
    }
}

export class ErrorPartyNameNotUnique extends DKError {
    constructor(name: string, party: Range) {
        super(`Party '${name}' already exists`, party.start, party.end);
    }
}

export class ErrorPartyUnknown extends DKError {
    constructor(name: string, party: Range) {
        super(`Unknown party '${name}'`, party.start, party.end);
    }
}

export class ErrorReturnCommandAtRootLvl extends DKError {
    constructor(exp: Range) {
        super(`Commands with return value can only be used as an argument`, exp.start, exp.end);
    }
}

export class ErrorCommandOnlyAtRootLvl extends DKError {
    constructor(exp: Range) {
        super(`Command only allowed inside of IF block`, exp.start, exp.end);
    }
}

export class ErrorCommandNotAtRootLvl extends DKError {
    constructor(exp: Range) {
        super(`Command not allowed outside of IF block`, exp.start, exp.end);
    }
}

export class ErrorExpectedFinal extends DKError {
    constructor(exp: Range) {
        super(`Expected final value, not a command`, exp.start, exp.end);
    }
}
