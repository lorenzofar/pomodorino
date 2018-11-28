/**
 * This module manages connection with websocket server
 * It provides methods to connect to the socket, check the connection status
 * stop the connection and sending messages.
 */

import * as socket_io from "socket.io-client";

const SOCKET_URL: string = "https://necstelectra.herokuapp.com";

class SocketManager{
    private static io = null;    

    public static connect(){
        // Before doing anything, check connection status
        //TODO: Retrieve credentials and build handshake message        
    }

    public static disconnect(){
        // Before doing anything, check connection status
    }

    public static get connectionStatus(){
        return null;
    }
}


export default SocketManager;