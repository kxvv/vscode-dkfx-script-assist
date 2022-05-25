import { SyntaxToken } from "../../Tokenizer";
import { XToken } from "./XToken";

export class TokenGroup {
    tokens: (XToken | TokenGroup)[] = [];
    opener: XToken;
    closer: XToken | null;
    start: number;
    end: number = Number.MAX_SAFE_INTEGER;

    constructor(tokens: (XToken | TokenGroup)[] = [], opener: XToken, closer: XToken | null = null) {
        this.tokens = tokens;
        this.opener = opener;
        this.closer = closer;
        this.start = opener.end;
        this.end = closer?.start || this.start;
    }

    isParensMatching() {
        if (this.opener.val === SyntaxToken.POpen && this.closer && this.closer.val === SyntaxToken.PClose) {
            return true;
        }
        return this.opener.val === SyntaxToken.BOpen && this.closer && this.closer.val === SyntaxToken.BClose;
    }
}
