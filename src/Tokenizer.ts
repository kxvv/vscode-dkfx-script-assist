import { Token } from "./model/Token";
import { TokenType } from "./model/TokenType";
import { TokenIndexMap } from "./model/TokenIndexMap";

export enum SyntaxToken {
    POpen = "(",
    PClose = ")",
    BOpen = "[",
    BClose = "]",
    ArgSep = ",",
};

export type SyntaxTokenOpt = SyntaxToken | "";

const REGEXPS = {
    words: /[-\w]+/g,
    operators: /(>=|<=|==|!=)|(=|!|>|<|~)/g, // TODO construct this regexp using enums
    whitespace: /\s/,
};

export class Tokenizer {
    static getWordTokensMap(txt: string): TokenIndexMap {
        const result: TokenIndexMap = {};
        [...txt.matchAll(REGEXPS.words)].forEach(match => {
            result[match.index || 0] = {
                val: match[0],
                start: match.index || 0,
                end: (match.index || 0) + match[0].length,
                type: TokenType.Word
            };
        });
        return result;
    }

    static getOperatorTokensMap(txt: string): TokenIndexMap {
        const result: TokenIndexMap = {};
        [...txt.matchAll(REGEXPS.operators)].forEach(match => {
            result[match.index || 0] = {
                val: match[0],
                start: match.index || 0,
                end: (match.index || 0) + match[0].length,
                type: !match[2]
                    ? TokenType.Operator
                    : (
                        (match[0] === ">" || match[0] === "<" || match[0] === "~")
                            ? TokenType.Operator
                            : TokenType.OperatorIncomplete
                    )
            };
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
        while (i < line.length) {
            char = chars[i];
            if (inString) {
                word.push(char);
                i++;
                if (char === `"`) {
                    inString = false;
                    result.push({
                        val: word.join(""),
                        start: i - word.length,
                        end: i,
                        type: TokenType.String
                    });
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
                    result.push({
                        val: line.substring(i, line.length),
                        start: i,
                        end: line.length,
                        type: TokenType.Comment
                    });
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
                result.push({
                    val: char,
                    start: i,
                    end: i + 1,
                    type: TokenType.Syntactic
                });
            }
            i++;
        }
        if (inString) {
            result.push({
                val: word.join(""),
                start: chars.length - word.length,
                end: chars.length,
                type: TokenType.StringIncomplete
            });
        }
        return result;
    };

}
