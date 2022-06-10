import { Token } from "../../interpreter/model/Token";
import { CommandDesc } from "../../model/CommandDesc";
import { TokenType } from "../../model/TokenType";

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

}
