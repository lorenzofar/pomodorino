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

// NOTE: During configuration, the device continues working id:54
import { modes, modeSubscriber } from "./models/modes";

class ModeManager {
    private static _mode: modes;

    private static subscribers: modeSubscriber[];

    public static initialize() {

        console.log("[MODE] initializing");

        // By default the device starts in AUTO mode
        this._mode = modes.AUTO;
        this.subscribers = [];
        this.subscribe = this.subscribe.bind(this);
    }

    public static subscribe(subscriber: modeSubscriber): boolean {
        let index = this.subscribers.map(s => s.id).indexOf(subscriber.id);
        if (index != -1) return false;
        this.subscribers.push(subscriber);
        console.log(`[MODE] ${subscriber.id} subscribed`);
        return true;
    }

    public static get mode(): modes {
        return this._mode;
    }

    public static set mode(newMode: modes) {
        console.log(`[MODE] changing device mode to ${newMode}`);
        this._mode = newMode;
        this.notifySubscribers();
    }

    private static notifySubscribers() {
        console.log("[MODE] notifying subscribers");
        this.subscribers.forEach(s => s.handler(this._mode));
    }
}

ModeManager.initialize();

export default ModeManager;