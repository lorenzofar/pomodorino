import * as http from "http";
import * as express from "express";
import * as path from "path";
import * as request from "request";

import ModeManager from "./modeManager";
import { modes } from "./models/modes";
import CredentialsManager from "./credentialsManager";


const { PORT = 3000 } = process.env;

const ID = "servermanager";

class ServerManager {

    private static app: express.Application;
    private static _server: http.Server;

    public static initialize() {
        console.log("[SERVER] initializing");

        /* ===== BINDINGS ===== */
        this.handleModeChange = this.handleModeChange.bind(this);

        // Subscribe to mode manager and listen to changes
        ModeManager.subscribe({ id: ID, handler: this.handleModeChange });

        /* ===== EXPRESS CONFIG ===== */
        this.app = express();

        this.app.get("/", (req: express.Request, res: express.Response) => {
            res.sendFile(path.join(__dirname + '/settingsPage.html'));
        });

        this.app.get("/login", (req: express.Request, res: express.Response) => {
            let qs = req.query;
            let username = qs && qs.username;
            let password = qs && qs.password;
            if (!username || !password) res.status(400).end();

            // Perform a request to electra
            // If succesful change content of credentials

            request.post("https://necstelectra.herokuapp.com/login", { form: { username: username, password: password, headless: true } },
                (err, response, body) => {
                    console.log(err);
                    console.log(response.statusCode);
                    switch (response.statusCode) {
                        case 200: // login succesful
                            CredentialsManager.updateUser(username, password);
                            res.status(200).send("credentials updated")
                            break;
                        case 403: // login error
                            res.status(403).send("login error");
                            break;
                    }
                }); 
        });
        //TODO: Set up other routes to change settings
    }

    private static handleModeChange(mode: modes) {
        console.log("[SERVER] received mode change notification");
        if (mode === modes.CONFIG || mode === modes.STREAM) {
            this.open();
        }
        else {
            this.close();
        }
    }

    /**
     * TODO:, NOTE: 
     * Find a way to authorize incoming requests and perform authentication with NECST APIs
     * since the device is not connected to the internet and hence we cannot connect to backend
     * We could provide an authentication check in the served webpage (w/ js),  
     * but it could suffer from user manipulation and lack of connection
     * 
     * > A possible solution could be to exchange a defined passphrase between the two parts
     * But also in this case, I could easily reverse engineer the device and find the passphrase
     * 
     * Or, at least, I can make an assumption: 
     * Given that the whole system is fault-tolerant and if a user tries to push invalid or unathorized
     * data they are rejected, I can still let the user configure the device as it likes, even setting
     * an user that does not exist.
     * 
     * However, to prevent intrusion from other people connecting to the device when the server is active
     * I could choose between two techniques:
     * > use a wi-fi authentication method - this is however tied to the communication tecnhology we choose to use
     *   and hence would not be valid anymore in case we switch to another one
     * > use a passphrase known only by the device and the user to sign messages
     *   It could be printed on an LCD screen connected to the device
     *   In this case it would be indipendent from the communication technology we rely on
    */

    public static open() {
        // First check if the server is already running
        // in case stop it to avoid issues
        if (this._server && this._server.listening) this._server.close();
        this._server = this.app.listen(PORT, () => {
            console.log(`[SERVER] > listening on port ${PORT}`);
        });
    }

    public static close() {
        if (this._server) {
            this._server.close();
            console.log("[SERVER] < closing server");
        }
    }
}

ServerManager.initialize();

export default ServerManager;