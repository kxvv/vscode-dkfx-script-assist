import { readFileSync } from "fs";
import { join } from "path";
import * as YAML from "yaml";
import { Entities } from "./Entities";
import { LoadedCommand, LoadedCommands } from "./model/LoadedCommand";

const RESOURCES_PATH = join(__dirname, "..", "resources");
const CMDS_PATH = "commands.yaml";
const CUSTOM_CMDS_PATH = "custom_commands.0.4.yaml";
const MAP_BROWSER_PATH = join(RESOURCES_PATH, "map_browser.html");

export class ResourcesLoader {
    static loadCommands(): LoadedCommands {
        Entities.insertCompositeTypes();
        const mainCmds =
            YAML.parse(ResourcesLoader.loadFileContents(join(RESOURCES_PATH, CMDS_PATH))) as LoadedCommand[];
        const customCmds =
            YAML.parse(ResourcesLoader.loadFileContents(join(RESOURCES_PATH, CUSTOM_CMDS_PATH))) as LoadedCommand[];
        return { values: mainCmds.concat(customCmds || []) };
    }

    static loadMapBrowserViewHtml(): string {
        return readFileSync(MAP_BROWSER_PATH).toString();
    }

    static loadFileContents(filePath: string): string {
        try {
            return readFileSync(filePath).toString();
        } catch (e) {
            console.error(e);
        }
        return "";
    }
}