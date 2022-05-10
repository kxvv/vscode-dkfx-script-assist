import { XToken } from "../../interpreter/model/XToken";
import { Exp } from "../../model/Exp";
import { ScriptAnalysis } from "../../model/ScriptAnalysis";
import { Token } from "../../model/Token";
import { TokenType } from "../../model/TokenType";
import { SyntaxToken } from "../../Tokenizer";

export const DUMMY_EXP_PARTS: Pick<Exp, "bgnPos" | "endPos" | "opens"> = {
    bgnPos: 256,
    endPos: 512,
    opens: SyntaxToken.POpen
};

export const createToken = (start: number, val: string, type = TokenType.Syntactic): Token => {
    const result: Token = {
        start,
        end: start + val.length,
        val,
        type
    };
    return result;
};

export const createExp = (value: string, start = 1): Exp => {
    return {
        args: [],
        start,
        end: start + value.length,
        bgnPos: start,
        endPos: start + value.length,
        value,
    };
};

export class TestUtils {
    static createScriptAnl(): ScriptAnalysis {
        return {
            diags: [],
            parties: [],
            timerWrites: [],
            timerReads: [],
            flagWrites: [],
            flagReads: [],
            msgSlots: {},
            versionWrites: [],
            apReads: [],
            apWrites: [],
            winsCount: 0,
            diagIgnoreLines: [],
        };
    }

    static createXToken(val: string, start: number, type = TokenType.Syntactic): XToken {
        return new XToken(val, start, type);
    };
}
