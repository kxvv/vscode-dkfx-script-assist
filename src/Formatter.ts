import { ConfigProvider } from "./ConfigProvider";
import { DescProvider } from "./DescProvider";
import { Tokenizer } from "./interpreter/Tokenizer";
import { CommandDesc } from "./model/CommandDesc";
import { ExtConfig, ExtConfigFormatter } from "./model/ExtConfig";
import { SyntaxToken, Token } from "./model/Token";
import { TokenType } from "./model/TokenType";

export class Formatter {
    static formatTextLines(lines: string[]): string[] {
        const result: string[] = [];
        const config: ExtConfig = ConfigProvider.getConfig();
        let tokens: Token[];
        let desc: CommandDesc | undefined;
        let ifCountStack = 0;
        for (const line of lines) {
            tokens = Tokenizer.tokenize(line);
            if (!tokens.length) {
                result.push("");
                continue;
            }
            desc = DescProvider.getCommandDesc(tokens[0].val);
            if (desc?.effects?.conditionPop && ifCountStack) {
                ifCountStack--;
            }
            result.push(Formatter.lineTokensToString(tokens, ifCountStack, config.formatter));
            if (desc?.effects?.conditionPush) {
                ifCountStack++;
            }
        }
        return result;
    }

    static lineTokensToString(line: Token[], indentCount: number, formatter: ExtConfigFormatter): string {
        const result: string[] = new Array(indentCount).fill(formatter.indentationString);
        const spacedSep = SyntaxToken.ArgSep + " ";
        let t: Token;
        for (let i = 0; i < line.length; i++) {
            t = line[i];
            if (t.type === TokenType.Syntactic) {
                if (t.val === "\u200b") {
                    continue;
                }
                if (formatter.spaceAfterSeparator && t.val === SyntaxToken.ArgSep) {
                    result.push(spacedSep);
                    continue;
                }
            }
            if (formatter.spacesAroundOperator && t.type === TokenType.Operator || t.type === TokenType.OperatorIncomplete) {
                result.push([" ", t.val, " "].join(""));
                continue;
            }
            if (line.length > 1 && t.type === TokenType.Comment) {
                result.push(" " + t.val);
                continue;
            }
            result.push(t.val);
        }
        return result.join("");
    }
}
