import { DK_ENTITIES } from "./Entities";
import { ExtConfig } from "./model/ExtConfig";
import { Indentations } from "./model/Indentations";
import { ParamType } from "./model/ParamType";

export class ConfigProvider {
    private static conf: ExtConfig = {
        diagEnabled: true,
        customTraps: [],
        customObjects: [],
        formatter: {
            spaceAfterSeparator: false,
            spacesAroundOperator: false,
            indentationString: Indentations.Tab,
        }
    };

    private static toIndentationChars(setting: string): string {
        if (/2\s+space/i.test(setting)) {
            return Indentations.TwoSpaces;
        }
        if (/4\s+space/i.test(setting)) {
            return Indentations.FourSpaces;
        }
        return Indentations.Tab;
    }

    static setConfig(config: ExtConfig) {
        this.conf = { ...config };
        this.conf.formatter = {
            ...this.conf.formatter,
            indentationString: this.toIndentationChars(this.conf.formatter.indentationString)
        };
        DK_ENTITIES[ParamType.Trap] = DK_ENTITIES[ParamType.Trap]
            .concat(config.customTraps.map(custom => ({
                val: custom.toUpperCase(),
                doc: "Custom trap"
            })));
        DK_ENTITIES[ParamType.Object] = DK_ENTITIES[ParamType.Object]
            .concat(config.customObjects.map(custom => ({
                val: custom.toUpperCase(),
                doc: "Custom object"
            })));
    }

    static getConfig(): ExtConfig {
        return this.conf;
    }
}