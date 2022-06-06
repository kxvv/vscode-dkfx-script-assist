import { DK_ENTITIES } from "./Entities";
import { XConst2 } from "./interpreter/model/XConst2";
import { XExp2 } from "./interpreter/model/XExp2";
import { DkEntity } from "./model/DkEntity";
import { SignatureHelper } from "./SignatureHelper";
import { Utils } from "./Utils";

export class HoverHelper {

    static getHoverForExp(exp: XExp2 | XConst2 | undefined, pos: number): string | null {
        if (exp instanceof XConst2 && Utils.isBetween(pos, exp.start, exp.end) && exp.getDesc()) {
            return SignatureHelper
                .hintFromDesc(exp.getDesc()!, exp.val, 0).heading + "\n\n" + (exp.getDesc()!.doc || "");
        } else if (exp instanceof XExp2) {
            if (Utils.isBetween(pos, exp.caller.start, exp.caller.end)) {
                return HoverHelper.getHoverForExp(new XConst2(null, exp.caller.val, exp.caller.start), pos);
            }
            const { child, leaf, index } = exp.getChildAtCursorPosition(pos);
            const childText = child?.val instanceof XConst2 ? child.val.val : "";
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