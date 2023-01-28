import { Parser } from "../../interpreter/Parser";
import { Preparser } from "../../interpreter/Preparser";
import { Tokenizer } from "../../interpreter/Tokenizer";
import { CommandDesc } from "../../model/CommandDesc";
import { Token } from "../../model/Token";
import { TokenType } from "../../model/TokenType";
import { ScriptChangeInfo, ScriptInstance } from "../../ScriptInstance";

export class TestUtils {

    static createXToken(val: string, start: number, type = TokenType.Syntactic): Token {
        return new Token(val, start, type);
    };

    static createDesc(): CommandDesc {
        return {
            autoTypes: false,
            bracketed: false,
            doc: "",
            params: [],
        };
    }

    static newScriptInstance(script: string): ScriptInstance {
        const result = new ScriptInstance("test");
        const change: ScriptChangeInfo = {
            shift: 0,
            shiftIndex: 0,
            documentLineCount: script.length,
            changes: script.split("\n").map((line, idx) => ([idx, Parser.parse(Preparser.preparse(Tokenizer.tokenize(line)))]))
        };
        result.update(change);
        return result;
    }
}
