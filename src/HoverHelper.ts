import { DK_ENTITIES } from "./Entities";
import { Exp } from "./interpreter/model/Exp";
import { Word } from "./interpreter/model/Word";
import { DkEntity } from "./model/DkEntity";
import { SignatureHelper } from "./SignatureHelper";
import { Utils } from "./Utils";

export class HoverHelper {

    static getHoverForExp(exp: Exp | Word | undefined, pos: number): string | null {
        if (exp instanceof Word && Utils.isBetween(pos, exp.start, exp.end) && exp.getDesc()) {
            return SignatureHelper
                .hintFromDesc(exp.getDesc()!, exp.val, 0).heading + "\n\n" + (exp.getDesc()!.doc || "");
        } else if (exp instanceof Exp) {
            if (Utils.isBetween(pos, exp.caller.start, exp.caller.end)) {
                return HoverHelper.getHoverForExp(new Word(null, exp.caller.val, exp.caller.start), pos);
            }
            const { child, leaf, index } = exp.getChildAtCursorPosition(pos);
            const childText = child?.val instanceof Word ? child.val.val : "";
            const leafDesc = leaf?.getDesc();
            if (leafDesc) {
                let paramHoverText = child?.getDescParam()?.name || "";
                let entityDoc = "";
                let foundEntity: DkEntity | undefined;
                for (const type of (child?.getDescParam()?.allowedTypes || [])) {
                    foundEntity = DK_ENTITIES[type]?.find(e => e.val.toUpperCase() === childText.toUpperCase());
                    if (foundEntity) {
                        entityDoc = foundEntity.doc || "";
                        break;
                    }
                }
                paramHoverText = `*${SignatureHelper.hintFromDesc(leafDesc, leaf!.caller.val, 0).params[index] || ""}*`;
                if (entityDoc) {
                    return `${paramHoverText}\n\n**${childText}**: ${entityDoc}`;
                }
                return paramHoverText;
            }
        }
        return null;
    }

}