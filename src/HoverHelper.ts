import { Entities } from "./Entities";
import { Exp } from "./model/Exp";
import { ExpChild } from "./model/ExpChild";
import { ParamType } from "./model/ParamType";
import { ScriptAnalysis } from "./model/ScriptAnalysis";
import { Word } from "./model/Word";
import { SignatureHelper } from "./SignatureHelper";
import { TypeTools } from "./TypeTools";
import { Utils } from "./Utils";

export class HoverHelper {

    static getHoverForExp(analysis: ScriptAnalysis, exp: Exp | Word | undefined, pos: number): string[] | null {
        if (exp instanceof Word && Utils.isBetween(pos, exp.start, exp.end) && exp.getDesc()) {
            return [SignatureHelper
                .hintFromDesc(exp.getDesc()!, exp.val, 0).heading + "\n\n" + (exp.getDesc()!.doc || "")];
        } else if (exp instanceof Exp) {
            if (Utils.isBetween(pos, exp.caller.start, exp.caller.end)) {
                return HoverHelper.getHoverForExp(analysis, new Word(null, exp.caller.val, exp.caller.start), pos);
            }
            const result = {
                commandParam: "",
                entityDoc: "",
                customDoc: "",
            };
            const { child, leaf, index } = exp.getChildAtCursorPosition(pos);
            const childText: string = child?.val instanceof Word ? child.val.val : "";
            const leafDesc = leaf?.getDesc();
            if (leafDesc) {
                let paramHoverText: string = child?.getDescParam()?.name || "";
                let entityDoc = "";

                if (child?.val instanceof Word) {
                    const childWord: Word = child.val;
                    const foundType = (child?.getDescParam()?.allowedTypes || [])
                        .find(type => TypeTools.toolFor(type).check({ word: childWord }));
                    const foundEntity = Entities.findEntity(foundType, childWord.val);
                    entityDoc = foundEntity?.doc || "";

                    if (foundType && leaf && index >= 0 && TypeTools.isTypeCustomDocumentable(foundType)) {
                        result.customDoc = HoverHelper.getCustomDocForVar(analysis, leaf, childWord, index, foundType);
                    }
                }

                paramHoverText = SignatureHelper.hintFromDesc(leafDesc, leaf!.caller.val, 0).params[index] || "";
                if (paramHoverText) {
                    paramHoverText = this.formatSuggestion("Command param " + (index + 1), paramHoverText);
                    result.commandParam = paramHoverText;
                    if (!result.customDoc && entityDoc) {
                        result.entityDoc = this.formatSuggestion(childText, entityDoc);
                    }
                }
            }
            return [result.commandParam, result.entityDoc, result.customDoc]
                .filter(Boolean);
        }
        return null;
    }

    private static getCustomDocForVar(analysis: ScriptAnalysis, leaf: Exp, childWord: Word, paramIndex: number, type: ParamType): string {
        // find exact type for composite types
        if ([ParamType.ReadVar, ParamType.SetVar, ParamType.ReadSetVar].includes(type)) {
            for (const exactType of [ParamType.Flag, ParamType.CampaignFlag, ParamType.Timer]) {
                const foundEntity = Entities.findEntity(exactType, childWord.val);
                if (foundEntity) {
                    return this.getCustomDocForVar(analysis, leaf, childWord, paramIndex, exactType);
                }
            }
            return "";
        }
        if (ParamType.Location === type) {
            if (TypeTools.toolFor(ParamType.ActionPoint).check({ word: childWord, })) {
                return this.getCustomDocForVar(analysis, leaf, childWord, paramIndex, ParamType.ActionPoint);
            } else if (TypeTools.toolFor(ParamType.HeroGate).check({ word: childWord, })) {
                return this.getCustomDocForVar(analysis, leaf, childWord, paramIndex, ParamType.HeroGate);
            }
            return "";
        }

        if ([ParamType.Flag, ParamType.CampaignFlag, ParamType.Timer].includes(type)) {
            const playerChild: ExpChild | undefined = leaf.getChild(paramIndex - 1);
            if (playerChild?.val instanceof Word) {
                const playerName = playerChild.val.val;
                const customDoc = analysis.getCustomDoc(type, childWord.val, playerName);
                if (customDoc) {
                    return this.formatSuggestion(customDoc.keyName, customDoc.doc);
                }
            }
        }
        if ([ParamType.ActionPoint, ParamType.HeroGate].includes(type)) {
            const customDoc = analysis.getCustomDoc(type, childWord.val, "");
            if (customDoc) {
                return this.formatSuggestion(customDoc.keyName, customDoc.doc);
            }
        }
        return "";
    }

    private static formatSuggestion(key: string, val: string) {
        return `<code>${key}:</code>${val}`;
    }
}