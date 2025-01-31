import { Entities } from "./Entities";
import { DkEntity } from "./model/DkEntity";
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
        customRooms: [],
        customSpells: [],
        customCreatureSpells: [],
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

    private static parseCustomEntity(doc: string, configStrings: string[]): DkEntity[] {
        return configStrings.map(cs => {
            return cs.replace(/[,;]/gi, '%').split('%').map(s => s.trim());
        })
            .flat()
            .filter(Boolean)
            .map(val => ({
                doc, val
            }));
    }

    static setConfig(config: ExtConfig) {
        this.conf = { ...config };
        this.conf.formatter = {
            ...this.conf.formatter,
            indentationString: this.toIndentationChars(this.conf.formatter.indentationString)
        };
        const customTraps = this.parseCustomEntity("Custom trap", config.customTraps);
        const customDoors = this.parseCustomEntity("Custom door", config.customDoors);
        const customCreatures = this.parseCustomEntity("Custom creature", config.customCreatures);
        const customObjects = this.parseCustomEntity("Custom object", config.customObjects);
        const customRooms = this.parseCustomEntity("Custom room", config.customRooms);
        const customSpells = this.parseCustomEntity("Custom spell", config.customSpells);
        const customCreatureSpells = this.parseCustomEntity("Custom creature spell", config.customCreatureSpells);
        Entities.setCustomEntities({
            traps: customTraps,
            crtrs: customCreatures,
            doors: customDoors,
            objects: customObjects,
            rooms: customRooms,
            spells: customSpells,
            creatureSpells: customCreatureSpells,
        });
    }

    static getConfig(): ExtConfig {
        return this.conf;
    }
}