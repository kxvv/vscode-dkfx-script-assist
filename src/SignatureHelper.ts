import { XExp2 } from "./interpreter/model/XExp2";
import { SignatureHint } from "./model/SignatureHint";
import { XCommandDesc } from "./model/XCommandDesc";
import { Utils } from "./Utils";

export class SignatureHelper {
    static getSignHelpForExp(exp: XExp2 | undefined, pos: number): SignatureHint | null {
        if (exp) {
            const { leaf, child, index, ahead } = exp.getChildAtCursorPosition(pos);
            if (child && leaf?.getDesc()) {
                return SignatureHelper.hintFromDesc(leaf.getDesc()!, leaf.caller.val, index + +ahead);
            }
        }
        return null;
    }

    static hintFromDesc(desc: XCommandDesc, cmdName: string, active: number): SignatureHint {
        const paramTexts = desc.params.map(p => `${p.name}: ${p.allowedTypes.join("/")}`);
        const parens = Utils.getParens(desc.bracketed);
        return {
            heading: paramTexts.length ? `${cmdName}${parens[0]}${paramTexts.join(", ")}${parens[1]}` : cmdName,
            active,
            params: paramTexts,
            doc: desc.doc
        };
    }
}