import { CronJob } from "cron";

const CLOCK = 2; // expressed in seconds
const CRON_SCHEDULE = `*/${CLOCK} * * * * *`;

class Orchestrator {
    private static clockJob: CronJob;

    public static initialize() {
        console.log("[CLOCK] initializing");
        this.tick = this.tick.bind(this);
        this.clockJob = new CronJob(CRON_SCHEDULE, this.tick);
        this.clockJob.start();
    }

    public static get jobStatus(): boolean {
        return this.clockJob.running;
    }

    private static tick() {

    }
}

Orchestrator.initialize();

export default Orchestrator;