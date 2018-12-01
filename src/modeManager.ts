/**
 * This module manages the mode the device is running in:
 * It receives events from physical buttons to switch mode
 * 
 * The allowed modes are: 
 *  - auto / the device just collects data
 *  - stream / the device tries to connect to the websocket (TODO: maybe also check connectio or so)
 *  - sync / receive sync request and start syncing (TODO: also provide indicator about sync status)
 *  - AP ON / the device creates an AP to change settings
 */

enum modes {
    AUTO,
    STREAM,
    SYNC,
    CONFIG
};

class ModeManager {
    private static _mode: modes;

    public static initialize(){
        this._mode = modes.AUTO;
    }

    public static get mode(): modes{
        return this._mode;
    }

    public static set mode(newMode: modes){
        this._mode = newMode;
    }

}

ModeManager.initialize();

export default ModeManager;