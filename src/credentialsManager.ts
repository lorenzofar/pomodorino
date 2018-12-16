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

    // Update the user stored in the device
    public static updateUser(username: string, password: string) {
        SettingsManager.setCredentials({ username: username, password: password }, () => {
            console.log("[CREDENTIALS] credentials updated succesfully");
        });
    }
}

export default CredentialsManager;