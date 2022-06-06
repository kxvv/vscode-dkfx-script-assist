import { XToken } from "../../interpreter/model/XToken";
import { TokenType } from "../../model/TokenType";
import { XCommandDesc } from "../../model/XCommandDesc";

export class TestUtils {

    static createXToken(val: string, start: number, type = TokenType.Syntactic): XToken {
        return new XToken(val, start, type);
    };

    static createDesc(): XCommandDesc {
        return {
            autoTypes: false,
            bracketed: false,
            doc: "",
            params: [],
        };
    }

}
