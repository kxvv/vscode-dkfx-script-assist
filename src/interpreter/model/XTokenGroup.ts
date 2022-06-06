import { XSyntaxToken, XToken } from "./XToken";

export class XTokenGroup {
    tokens: (XToken | XTokenGroup)[] = [];
    opener: XToken;
    closer: XToken | null;
    start: number;
    end: number = Number.MAX_SAFE_INTEGER;

    constructor(tokens: (XToken | XTokenGroup)[] = [], opener: XToken, closer: XToken | null = null) {
        this.tokens = tokens;
        this.opener = opener;
        this.closer = closer;
        this.start = opener.end;
        this.end = closer?.start || this.start;
    }

    isParensMatching() {
        if (this.opener.val === XSyntaxToken.POpen && this.closer && this.closer.val === XSyntaxToken.PClose) {
            return true;
        }
        return this.opener.val === XSyntaxToken.BOpen && this.closer && this.closer.val === XSyntaxToken.BClose;
    }
}
