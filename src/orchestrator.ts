import { CronJob } from "cron";

import ModeManager from "./modeManager";
import { modes } from "./models/modes";

import DataRetriever from "./dataRetriever";
import DbManager from "./dbManager";
import CredentialsManager from "./credentialsManager";
import SocketManager from "./socketManager";

const { CLOCK = 2 } = process.env; // expressed in seconds
const CRON_SCHEDULE = `*/${CLOCK} * * * * *`;

class Orchestrator {
    private static clockJob: CronJob;

    private static tickCount: number;
    private static username: string;

    public static initialize() {
        console.log("[CLOCK] initializing");
        this.tickCount = 0;
        this.tick = this.tick.bind(this);
        this.clockJob = new CronJob(CRON_SCHEDULE, this.tick);
        this.clockJob.start();
        CredentialsManager.getCredentials(credentials => this.username = credentials.username);
    }

    public static get jobStatus(): boolean {
        return this.clockJob.running;
    }

    private static tick() {
        //TODO: Read data from sensors
        let data = DataRetriever.data;
        DbManager.insertDataPoint(this.username, data);
        if (ModeManager.mode === modes.STREAM) SocketManager.emitDataPoint(data);
        //TODO: Call analyzer function
        //TODO: Pack everything
        //TODO: Check if the socket is active and send
    }
}

Orchestrator.initialize();

export default Orchestrator;