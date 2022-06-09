import { TokenType } from "../model/TokenType";
import { Token, XTokenIndexMap } from "./model/Token";

const REGEXPS = {
    words: /[-\w]+/g,
    operators: /(>=|<=|==|!=)|(=|!|>|<|~)/g,
    whitespace: /\s/,
};

export class Tokenizer {
    static getWordTokensMap(txt: string): XTokenIndexMap {
        const result: XTokenIndexMap = {};
        [...txt.matchAll(REGEXPS.words)].forEach(match => {
            result[match.index || 0] = new Token(match[0], match.index || 0, TokenType.Word);
        });
        return result;
    }

    static getOperatorTokensMap(txt: string): XTokenIndexMap {
        const result: XTokenIndexMap = {};
        [...txt.matchAll(REGEXPS.operators)].forEach(match => {
            const type: TokenType = !match[2]
                ? TokenType.Operator
                : (
                    (match[0] === ">" || match[0] === "<" || match[0] === "~")
                        ? TokenType.Operator
                        : TokenType.OperatorIncomplete
                );
            result[match.index || 0] = new Token(match[0], match.index || 0, type);
        });
        return result;
    };

    static tokenize(line: string): Token[] {
        const wordMap = Tokenizer.getWordTokensMap(line);
        const operatorMap = Tokenizer.getOperatorTokensMap(line);
        const result: Token[] = [];
        const chars = line.split("");

        let i = 0;
        let inString = false;
        let char;
        let wordToken: Token;
        let operatorToken: Token;
        let word: string[] = [];
        let tkn: Token;
        while (i < line.length) {
            char = chars[i];
            if (inString) {
                word.push(char);
                i++;
                if (char === `"`) {
                    inString = false;
                    tkn = new Token(word.join(""), i - word.length, TokenType.String);
                    tkn.end = i;
                    result.push(tkn);
                    word = [];
                }
                continue;
            } else if (char === `"`) {
                word.push(char);
                inString = true;
                i++;
                continue;
            }

            wordToken = wordMap[i];
            if (wordToken) {
                if (wordToken.val.toUpperCase().startsWith("REM")) {
                    tkn = new Token(line.substring(i, line.length), i, TokenType.Comment);
                    tkn.end = line.length;
                    result.push(tkn);
                    break;
                } else {
                    result.push(wordToken);
                    i = wordToken.end;
                    continue;
                }
            }

            operatorToken = operatorMap[i];
            if (operatorToken) {
                result.push(operatorToken);
                i = operatorToken.end;
                continue;
            }

            if (!REGEXPS.whitespace.test(char) && char !== "\u200b") {
                tkn = new Token(char, i, TokenType.Syntactic);
                result.push(tkn);
            }
            i++;
        }
        if (inString) {
            tkn = new Token(word.join(""), chars.length - word.length, TokenType.StringIncomplete);
            tkn.end = chars.length;
            result.push(tkn);
        }
        return result;
    };
}
