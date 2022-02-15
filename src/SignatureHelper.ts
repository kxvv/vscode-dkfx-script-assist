import { DescProvider } from "./DescProvider";
import { CommandDesc } from "./model/CommandDesc";
import { Exp } from "./model/Exp";
import { SignatureHint } from "./model/SignatureHint";
import { Utils } from "./Utils";

export class SignatureHelper {
    static getSignHelpForExp(exp: Exp | undefined, pos: number): SignatureHint | null {
        let arg: Exp;
        let index = -1;
        if (exp && Utils.isBetween(pos, exp.bgnPos, exp.endPos)) {
            for (let i = 0; i < exp.args.length; i++) {
                arg = exp.args[i];
                if (Utils.isBetween(pos, arg.bgnPos, arg.endPos)) {
                    if (arg.args.length) {
                        return SignatureHelper.getSignHelpForExp(arg, pos);
                    }
                    index = i;
                }
            }
            const desc = DescProvider.getCommandDesc(exp);
            if (desc) { return SignatureHelper.hintFromDesc(desc, exp.value, index); }
        }
        return null;
    }

    static hintFromDesc(desc: CommandDesc, cmdName: string, active: number): SignatureHint {
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