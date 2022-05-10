import { TokenType } from "../model/TokenType";
import { XToken, XTokenIndexMap } from "./model/XToken";

const REGEXPS = {
    words: /[-\w]+/g,
    operators: /(>=|<=|==|!=)|(=|!|>|<|~)/g, // TODO construct this regexp using enums
    whitespace: /\s/,
};

export class XTokenizer {
    static getWordTokensMap(txt: string): XTokenIndexMap {
        const result: XTokenIndexMap = {};
        [...txt.matchAll(REGEXPS.words)].forEach(match => {
            result[match.index || 0] = new XToken(match[0], match.index || 0, TokenType.Word);
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
            result[match.index || 0] = new XToken(match[0], match.index || 0, type);
        });
        return result;
    };

    static tokenize(line: string): XToken[] {
        const wordMap = XTokenizer.getWordTokensMap(line);
        const operatorMap = XTokenizer.getOperatorTokensMap(line);
        const result: XToken[] = [];
        const chars = line.split("");

        let i = 0;
        let inString = false;
        let char;
        let wordToken: XToken;
        let operatorToken: XToken;
        let word: string[] = [];
        let tkn: XToken;
        while (i < line.length) {
            char = chars[i];
            if (inString) {
                word.push(char);
                i++;
                if (char === `"`) {
                    inString = false;
                    tkn = new XToken(word.join(""), i - word.length, TokenType.String);
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
                    tkn = new XToken(line.substring(i, line.length), i, TokenType.Comment);
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

            if (!REGEXPS.whitespace.test(char)) {
                tkn = new XToken(char, i, TokenType.Syntactic);
                result.push(tkn);
            }
            i++;
        }
        if (inString) {
            tkn = new XToken(word.join(""), chars.length - word.length, TokenType.StringIncomplete);
            tkn.end = chars.length;
            result.push(tkn);
        }
        return result;
    };
}
