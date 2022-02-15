import { DescProvider } from "./DescProvider";
import { DK_ENTITIES } from "./Entities";
import { CommandDesc } from "./model/CommandDesc";
import { Exp } from "./model/Exp";
import { SignatureHelper } from "./SignatureHelper";
import { Utils } from "./Utils";

export class HoverHelper {
    static getHoverForExp(exp: Exp | undefined, pos: number): string | null {
        if (!exp) {
            return null;
        }
        let cmdNameEndPos = exp.start + exp.value.length;
        let desc: CommandDesc | null;
        let arg: Exp;
        if (Utils.isBetween(pos, exp.start, cmdNameEndPos)) {
            if (desc = DescProvider.getCommandDesc(exp.value)) {
                return SignatureHelper.hintFromDesc(desc, exp.value, 0).heading + "\n\n" + (desc.doc || "");
            }
        }
        desc = DescProvider.getCommandDesc(exp);
        for (let i = 0; i < exp.args.length; i++) {
            arg = exp.args[i];
            if (Utils.isBetween(pos, arg.start, arg.end)) {
                if (DescProvider.getCommandDesc(arg.value)) {
                    return this.getHoverForExp(arg, pos);
                }
                if (desc) {
                    const paramTypes = desc.params[i];
                    for (const at of paramTypes.allowedTypes) {
                        const paramTitle = `*${SignatureHelper.hintFromDesc(desc, exp.value, 0).params[i] || ""}*`;
                        for (const e of (DK_ENTITIES[at] || [])) {
                            if (e.val.toUpperCase() === arg.value.toUpperCase()) {
                                if (e.doc) {
                                    return `${paramTitle}\n\n**${arg.value}**: ${e.doc}`;
                                }
                            }
                        }
                        return paramTitle;
                    }
                }
            }
        }
        return null;
    }
}