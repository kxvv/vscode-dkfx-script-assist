import { TokenType } from "../model/TokenType";
import { Utils } from "../Utils";
import { XTokenGroup } from "./model/XTokenGroup";
import { XSyntaxToken, XToken } from "./model/XToken";

export class PreparsedStatement {
    tokens: (XToken | XTokenGroup)[] = [];
    comment?: XToken;

    constructor(tokens: (XToken | XTokenGroup)[] = [], comment?: XToken) {
        this.tokens = tokens;
        if (comment) { this.comment = comment; }
    }
}

export class XPreparser {

    // groups tokens and makes sure comment is moved into comment prop and is removed from tokens
    static preparse(tokens: XToken[]): PreparsedStatement {
        if (!tokens.length) {
            return new PreparsedStatement;
        }
        if (tokens.length === 1 && tokens[0].type === TokenType.Comment) {
            return new PreparsedStatement([], tokens[0]);
        }

        tokens = [...tokens];

        const result: PreparsedStatement = new PreparsedStatement;
        if (Utils.arrayPeek(tokens)!.type === TokenType.Comment) {
            result.comment = tokens.pop()!;
        }

        const tokenGroupStack: XTokenGroup[] = [];
        let tkn: XToken;
        let topGroup: XTokenGroup | undefined;
        for (let i = 0; i < tokens.length; i++) {
            tkn = tokens[i];
            topGroup = Utils.arrayPeek(tokenGroupStack);
            if (tkn.type === TokenType.Syntactic) {
                if (tkn.val === XSyntaxToken.BOpen || tkn.val === XSyntaxToken.POpen) {
                    const newGroup: XTokenGroup = new XTokenGroup([], tkn);
                    (topGroup || result).tokens.push(newGroup);
                    tokenGroupStack.push(newGroup);
                } else if (tkn.val === XSyntaxToken.BClose || tkn.val === XSyntaxToken.PClose) {
                    if (topGroup) {
                        topGroup.closer = tkn;
                        topGroup.end = tkn.start;
                        tokenGroupStack.pop();
                    } else {
                        result.tokens.push(tkn);
                    }
                } else {
                    (topGroup || result).tokens.push(tkn);
                }
            } else {
                (topGroup || result).tokens.push(tkn);
            }
        }

        return result;
    }
}

