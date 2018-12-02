import * as fs from "fs";
import * as locks from "locks";

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
    private static configExists(): boolean {
        return fs.existsSync(`./${CONFIG_FILE_NAME}`);
    }

    private static initMutex: locks.Mutex;

    public static initialize() {

        console.log("[SETTINGS] initializing");

        this.initMutex = new locks.Mutex();

        /* ===== BINDINGS ===== */
        this.touchConfigFile = this.touchConfigFile.bind(this);
        this.readConfigFile = this.readConfigFile.bind(this);
        this.writeConfigFile = this.writeConfigFile.bind(this);

        // Manage concurrency
        this.initMutex.lock(this.touchConfigFile);
        this.initMutex.lock(this.readConfigFile);

        //TODO: Continue initialization
    }

    /* ===== CONFIG FILE MANAGEMENT ===== */

    private static touchConfigFile() {
        if (!this.configExists()) this.createBlankConfig();
        else this.initMutex.unlock();
    }

    private static writeConfigFile(config: Config) {
        let jsonConfig = JSON.stringify(config);
        fs.writeFile(`./${CONFIG_FILE_NAME}`, jsonConfig, "utf8", () => {
            console.log("[SETTINGS] written config file");
            this.initMutex.unlock();
        });
    }

    private static readConfigFile(): Config {
        // The function always provides a configuration object
        // If the file is not present, it is created and then returned

        let rawData = fs.readFileSync(`./${CONFIG_FILE_NAME}`, "utf8");
        let data: Config = JSON.parse(rawData); // Parse JSON string
        this.initMutex.unlock();
        return data;
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