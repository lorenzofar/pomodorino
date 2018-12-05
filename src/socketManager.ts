/**
 * This module manages connection with websocket server
 * It provides methods to connect to the socket, check the connection status
 * stop the connection and sending messages.
 */

import * as socket_io from "socket.io-client";

import { modes } from "./models/modes";
import ModeManager from "./modeManager";

import CredentialsManager from "./credentialsManager";

const { SOCKET_URL = "http://localhost:3000" } = process.env;

const ID = "socketmanager";

class SocketManager {
    private static io: SocketIOClient.Socket = null;

    //TODO: Hook module to credentials manager to fire an event 
    // when credentials change and reconnect the socket accordingly

    //TODO: During initialization, socket manager should understand in which mode the 
    // device is working in and start the websocket if needed

    public static initialize() {

        console.log("[SOCKET] initializing");

        /* ===== BINDINGS ===== */
        this.handleModeChange = this.handleModeChange.bind(this);

        /* ===== HANDSHAKE CONFIG ===== */
        let credentials = CredentialsManager.credentials;
        let qs = `username=${credentials.username}&password=${credentials.password}&mode=provider`;
        this.io = socket_io(SOCKET_URL, { autoConnect: false, query: qs });

        /** NOTE:
         * Here we do not perform a check on credentials to prevent connecting when they are null, 
         * since the connection request will be rejected by the server and would be a useless check
         */

        // Subscribe to mode manager and listen to changes
        let subscriptionResult = ModeManager.subscribe({ id: ID, handler: this.handleModeChange });
    }

    private static handleModeChange(mode: modes) {
        if (mode === modes.STREAM) {
            this.connect();
        }
        else {
            this.disconnect();
        }
    }

    public static connect() {
        if (this.io == null) return;

        console.log("[SOCKET] opening connection")

        this.io.open();

        //TODO: Find a way to understand if an error happened during connection

        this.io.on("connect", () => {
            console.log("Socket connected");
        });
        this.io.on("disconnect", () => {
            console.log("Socket disconnected");
        });

    }

    public static disconnect() {
        console.log("[SOCKET] closing connection");
        this.io.disconnect();
        this.io.close();
    }

    public static get connectionStatus() {
        return this.io.connected;
    }
}

SocketManager.initialize();

export default SocketManager;