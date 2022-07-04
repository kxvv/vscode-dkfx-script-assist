import { DK_ENTITIES } from "./Entities";
import { DkEntity } from "./model/DkEntity";
import { ExtConfig } from "./model/ExtConfig";
import { Indentations } from "./model/Indentations";
import { ParamType } from "./model/ParamType";

export class ConfigProvider {
    private static conf: ExtConfig = {
        diagEnabled: true,
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
    private static origTraps: DkEntity[] = DK_ENTITIES[ParamType.Trap];
    private static origDoors: DkEntity[] = DK_ENTITIES[ParamType.Door];
    private static origCreatures: DkEntity[] = DK_ENTITIES[ParamType.Creature];
    private static origObjects: DkEntity[] = DK_ENTITIES[ParamType.Object];

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
        DK_ENTITIES[ParamType.Trap] = this.origTraps.concat(customTraps);
        DK_ENTITIES[ParamType.Door] = this.origDoors.concat(customDoors);
        DK_ENTITIES[ParamType.Creature] = this.origCreatures.concat(customCreatures);
        DK_ENTITIES[ParamType.Object] = this.origObjects.concat(customObjects);
    }

    static getConfig(): ExtConfig {
        return this.conf;
    }
}