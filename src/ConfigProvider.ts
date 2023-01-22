import { Entities } from "./Entities";
import { ExtConfig } from "./model/ExtConfig";
import { Indentations } from "./model/Indentations";

export class ConfigProvider {
    private static conf: ExtConfig = {
        diagEnabled: true,
        diagReactionTime: 512,
        customTraps: [],
        customDoors: [],
        customCreatures: [],
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
        const customTraps = config.customTraps.map(custom => ({
            val: custom.toUpperCase(),
            doc: "Custom trap"
        }));
        const customDoors = config.customDoors.map(custom => ({
            val: custom.toUpperCase(),
            doc: "Custom door"
        }));
        const customCreatures = config.customCreatures.map(custom => ({
            val: custom.toUpperCase(),
            doc: "Custom creature"
        }));
        const customObjects = config.customObjects.map(custom => ({
            val: custom.toUpperCase(),
            doc: "Custom object"
        }));
        Entities.setCustomEntities(customTraps, customDoors, customCreatures, customObjects);
    }

    static getConfig(): ExtConfig {
        return this.conf;
    }
}