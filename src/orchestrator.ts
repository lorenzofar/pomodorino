import { CronJob } from "cron";

import ModeManager from "./modeManager";
import { modes } from "./models/modes";

import DataRetriever from "./dataRetriever";

const CLOCK = 2; // expressed in seconds
const CRON_SCHEDULE = `*/${CLOCK} * * * * *`;

class Orchestrator {
    private static clockJob: CronJob;

    private static tickCount: number;

    public static initialize() {
        console.log("[CLOCK] initializing");
        this.tickCount = 0;
        this.tick = this.tick.bind(this);
        this.clockJob = new CronJob(CRON_SCHEDULE, this.tick);
        this.clockJob.start();
    }

    public static get jobStatus(): boolean {
        return this.clockJob.running;
    }

    private static tick() {
        //TODO: Read data from sensors id:50
        let data = DataRetriever.data;
        //TODO: Call analyzer function id:35
        //TODO: Pack everything id:40
        //TODO: Check if the socket is active and send id:45
    }
}

Orchestrator.initialize();

export default Orchestrator;