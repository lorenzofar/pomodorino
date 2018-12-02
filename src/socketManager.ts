/**
 * This module manages connection with websocket server
 * It provides methods to connect to the socket, check the connection status
 * stop the connection and sending messages.
 */

import * as socket_io from "socket.io-client";

import { modes } from "./models/modes";
import ModeManager from "./modeManager";

const SOCKET_URL: string = "http://localhost:3000";

const ID = "socketmanager";

class SocketManager {
    private static io: SocketIOClient.Socket = null;

    //TODO: Hook module to credentials manager to fire an event 
    // when credentials change and reconnect the socket accordingly

    //TODO: During initialization, socket manager should understand in which the 
    // device is working in and start the websocket if needed

    public static initialize() {

        console.log("[SOCKET] initializing");

        /* ===== BINDINGS ===== */

        this.handleModeChange = this.handleModeChange.bind(this);

        let email: string;
        let password: string;
        let qs = `username=${email}&password=${password}&mode=provider`;
        this.io = socket_io(SOCKET_URL, { autoConnect: false, query: qs });

        // Subscribe to mode manager and listen to changes
        let subscriptionResult = ModeManager.subscribe({ id: ID, handler: this.handleModeChange });

        // Subscribe to mode changes
    }

    private static handleModeChange(mode: modes) {
        //TODO: Connect / disconnect socket accordingly
        if (mode == modes.STREAM) {
            this.connect();
        }
        else {
            this.disconnect();
        }
    }

    public static connect() {
        // Before doing anything, check connection status
        //TODO: Retrieve credentials and build handshake message  
        if (this.io == null) return;

        console.log("[SOCKET] opening connection")

        this.io.open();

        this.io.on("connect", () => {
            console.log("Socket connected");
        });
        this.io.on("disconnect", () => {
            console.log("Socket disconnected");
        });

    }

    public static disconnect() {
        console.log("[SOCKET] closing connection");

        // Before doing anything, check connection status
        this.io.disconnect();
        this.io.close();
    }

    public static get connectionStatus() {
        return this.io.connected;
    }
}

SocketManager.initialize();

export default SocketManager;