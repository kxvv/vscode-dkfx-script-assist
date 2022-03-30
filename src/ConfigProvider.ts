import { DK_ENTITIES } from "./Entities";
import { ExtConfig } from "./model/ExtConfig";
import { ParamType } from "./model/ParamType";

export class ConfigProvider {
    private static conf: ExtConfig = {
        diagEnabled: true,
        customTraps: [],
        formatter: {
            spaceAfterSeparator: false,
            spacesAroundOperator: false,
            indentationString: "\t",
        }
    };

    private static toIndentationChars(setting: string): string {
        if (/2\s+space/i.test(setting)) {
            return "  ";
        }
        if (/4\s+space/i.test(setting)) {
            return "    ";
        }
        return "\t";
    }

    static setConfig(config: ExtConfig) {
        this.conf = { ...config };
        this.conf.formatter = {
            ...this.conf.formatter,
            indentationString: this.toIndentationChars(this.conf.formatter.indentationString)
        };
        DK_ENTITIES[ParamType.Trap] = DK_ENTITIES[ParamType.Trap]
            .concat(config.customTraps.map(ct => ({
                val: ct.toUpperCase()
            })));
    }

    static getConfig(): ExtConfig {
        return this.conf;
    }
}