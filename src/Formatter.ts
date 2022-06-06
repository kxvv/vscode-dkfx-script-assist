import { ConfigProvider } from "./ConfigProvider";
import { XToken } from "./interpreter/model/XToken";
import { XTokenizer } from "./interpreter/XTokenizer";
import { ExtConfig, ExtConfigFormatter } from "./model/ExtConfig";
import { TokenType } from "./model/TokenType";
import { XCommandDesc } from "./model/XCommandDesc";
import { XDescProvider } from "./XDescProvider";

export class Formatter {
    static formatTextLines(lines: string[]): string[] {
        const result: string[] = [];
        const config: ExtConfig = ConfigProvider.getConfig();
        let tokens: XToken[];
        let desc: XCommandDesc | undefined;
        let ifCountStack = 0;
        for (const line of lines) {
            tokens = XTokenizer.tokenize(line);
            if (!tokens.length) {
                result.push("");
                continue;
            }
            desc = XDescProvider.getCommandDesc(tokens[0].val);
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

    static lineTokensToString(line: XToken[], indentCount: number, formatter: ExtConfigFormatter): string {
        const result: string[] = new Array(indentCount).fill(formatter.indentationString);
        let t: XToken;
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
