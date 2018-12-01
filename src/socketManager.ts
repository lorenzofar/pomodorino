/**
 * This module manages connection with websocket server
 * It provides methods to connect to the socket, check the connection status
 * stop the connection and sending messages.
 */

import * as socket_io from "socket.io-client";

const SOCKET_URL: string = "http://localhost:3000";

class SocketManager {
    private static io: SocketIOClient.Socket = null;

    //TODO: Hook module to credentials manager to fire an event id:15
    // when credentials change and reconnect the socket accordingly

    public static initialize() {
        let email: string;
        let password: string;
        let qs = `username=${email}&password=${password}&mode=provider`;
        this.io = socket_io(SOCKET_URL, { autoConnect: false, query: qs });
    }

    public static connect() {
        // Before doing anything, check connection status
        //TODO: Retrieve credentials and build handshake message id:3
        if (this.io == null) return;

        this.io.open();
        
        this.io.on("connect", () => {
            console.log("Socket connected");
        });
        this.io.on("disconnect", () => {
            console.log("Socket disconnected");
        });

    }

    public static disconnect() {
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