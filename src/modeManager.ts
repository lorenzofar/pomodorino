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

// NOTE: During configuration, the device continues working
import { modes, modeSubscriber } from "./models/modes";
import { Gpio } from "onoff";

const STREAMING_BTN_PIN = 2;
const CONFIG_BTN_PIN = 3;

class ModeManager {
    private static _mode: modes;

    private static STREAM_BTN: Gpio;
    private static CONFIG_BTN: Gpio;

    private static subscribers: modeSubscriber[];

    public static initialize() {

        console.log("[MODE] initializing");

        // By default the device starts in AUTO mode
        this._mode = modes.AUTO;
        this.subscribers = [];
        this.subscribe = this.subscribe.bind(this);
        this.toggleStreamMode = this.toggleStreamMode.bind(this);
        this.toggleConfigMode = this.toggleConfigMode.bind(this);

        // Get buttons and bind them to mode change
        this.STREAM_BTN = new Gpio(STREAMING_BTN_PIN, "in", "rising");
        this.CONFIG_BTN = new Gpio(CONFIG_BTN_PIN, "in", "rising");
        this.STREAM_BTN.watch(this.toggleStreamMode);
        this.CONFIG_BTN.watch(this.toggleConfigMode);
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

    /* ===== MODES TOGGLING ===== */
    private static toggleStreamMode(){
        this.mode = modes.STREAM;
    }

    private static toggleConfigMode(){
        this.mode = modes.CONFIG;
    }   
}

ModeManager.initialize();

export default ModeManager;