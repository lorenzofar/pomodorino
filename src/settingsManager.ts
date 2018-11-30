import * as fs from "fs";

const CONFIG_FILE_NAME = "config.json";

interface Config {
    credentials: {
        username: string;
        password: string;
    };
    thresholds: {
        [sensor: string]: number | null;
    };
}

class SettingsManager {
    private static configExists = (): boolean => fs.existsSync(`./${CONFIG_FILE_NAME}`);

    public static initialize() {
        if (!this.configExists()) {
            this.createBlankConfig();
        };
        //TODO: Continue initialization
    }

    /* ===== CONFIG FILE MANAGEMENT ===== */

    private static writeConfigFile(config: Config) {
        let jsonConfig = JSON.stringify(config);
        fs.writeFile(`./${CONFIG_FILE_NAME}`, jsonConfig, "utf8", () => console.log(`[SETTINGS] Succesfully written config file`));
    }

    private static createBlankConfig() {
        //TODO: Create config file with blank structure
        //TODO: Add sensors to initial thresholds
        //TODO: When retrieving settings also check if field exists for that sensor
        console.log(`[SETTINGS] config file is missing, initializing...`);
        let blankConfig: Config = {
            credentials: {
                username: null,
                password: null
            },
            thresholds: {}
        }
        this.writeConfigFile(blankConfig);
    }
}

SettingsManager.initialize();

export default SettingsManager;