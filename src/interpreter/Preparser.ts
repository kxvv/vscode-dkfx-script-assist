import { SyntaxToken, Token } from "../model/Token";
import { TokenGroup } from "../model/TokenGroup";
import { TokenType } from "../model/TokenType";
import { Utils } from "../Utils";

export class PreparsedStatement {
    tokens: (Token | TokenGroup)[] = [];
    comment?: Token;

    constructor(tokens: (Token | TokenGroup)[] = [], comment?: Token) {
        this.tokens = tokens;
        if (comment) { this.comment = comment; }
    }
}

export class Preparser {

    // groups tokens and makes sure comment is moved into comment prop and is removed from tokens
    static preparse(tokens: Token[]): PreparsedStatement {
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

        const tokenGroupStack: TokenGroup[] = [];
        let tkn: Token;
        let topGroup: TokenGroup | undefined;
        for (let i = 0; i < tokens.length; i++) {
            tkn = tokens[i];
            topGroup = Utils.arrayPeek(tokenGroupStack);
            if (tkn.type === TokenType.Syntactic) {
                if (tkn.val === SyntaxToken.BOpen || tkn.val === SyntaxToken.POpen) {
                    const newGroup: TokenGroup = new TokenGroup([], tkn);
                    (topGroup || result).tokens.push(newGroup);
                    tokenGroupStack.push(newGroup);
                } else if (tkn.val === SyntaxToken.BClose || tkn.val === SyntaxToken.PClose) {
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

