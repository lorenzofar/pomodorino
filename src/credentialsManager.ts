import SettingsManager from "./settingsManager";

/**
 * This module provides access to user credentials
 * It is used to retrieve user information in order
 * to connect to the server and emit data
 */

class CredentialsManager {
    public static getCredentials(callback: (credentials: any) => void) {
        SettingsManager.getConfig((config) => {
            callback(config.credentials);
        });
    }
}

export default CredentialsManager;