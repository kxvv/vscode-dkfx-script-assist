import { DK_ENTITIES } from "./Entities";
import { ExtConfig } from "./model/ExtConfig";
import { ParamType } from "./model/ParamType";

export class ConfigProvider {
    private static conf: ExtConfig = {
        diagEnabled: true,
        customTraps: [],
    };

    static setConfig(config: ExtConfig) {
        this.conf = config;
        DK_ENTITIES[ParamType.Trap] = DK_ENTITIES[ParamType.Trap]
            .concat(config.customTraps.map(ct => ({
                val: ct.toUpperCase()
            })));
    }

    static getConfig(): Partial<ExtConfig> {
        return this.conf;
    }
}