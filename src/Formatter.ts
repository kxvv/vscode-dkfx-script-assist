import { ConfigProvider } from "./ConfigProvider";
import { DescProvider } from "./DescProvider";
import { CommandDesc } from "./model/CommandDesc";
import { ExtConfig, ExtConfigFormatter } from "./model/ExtConfig";
import { Token } from "./model/Token";
import { TokenType } from "./model/TokenType";
import { Tokenizer } from "./Tokenizer";

export class Formatter {
    static formatTextLines(lines: string[]): string[] {
        const result: string[] = [];
        const config: ExtConfig = ConfigProvider.getConfig();
        let tokens: Token[];
        let desc: CommandDesc | null;
        let ifCountStack = 0;
        for (const line of lines) {
            tokens = Tokenizer.tokenize(line);
            if (!tokens.length) {
                result.push("");
                continue;
            }
            desc = DescProvider.getCommandDesc(tokens[0].val);
            if (desc && desc.isConditionPop && ifCountStack) {
                ifCountStack--;
            }
            result.push(Formatter.lineTokensToString(tokens, ifCountStack, config.formatter));
            if (desc && desc.isConditionPush) {
                ifCountStack++;
            }
        }
        return result;
    }

    static lineTokensToString(line: Token[], indentCount: number, formatter: ExtConfigFormatter): string {
        const result: string[] = new Array(indentCount).fill(formatter.indentationString);
        let t: Token;
        for (let i = 0; i < line.length; i++) {
            t = line[i];
            if (t.type === TokenType.Syntactic) {
                if (t.val === "\u200b") {
                    continue;
                }
                if (formatter.spaceAfterSeparator && t.val === ",") {
                    result.push(", ");
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
