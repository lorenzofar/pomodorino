import * as knex from "knex";
import * as locks from "locks";

import DataPoint from "./models/dataPoint";

const config = {
    client: 'pg',
    connection: process.env.DATABASE_URL
}

class DbManager {

    private static dbClient: knex;

    private static dbMutex: locks.Mutex;

    public static initialize() {

        console.log("[DB] initializing");

        this.dbClient = knex(config);
        this.dbMutex = new locks.Mutex();

        /* ===== BINDINGS ===== */
        this.touchUserTable = this.touchUserTable.bind(this);
        this.createUserTable = this.createUserTable.bind(this);
        this.insertDataPoint = this.insertDataPoint.bind(this);
    }

    public static async insertDataPoint(username: string, dataPoint: DataPoint) {
        if (!username || username == "") return;
        await this.touchUserTable(username);
        this.dbMutex.lock(() => {
            this.dbClient(username).insert(dataPoint.data)
                .catch(err => {
                    console.log(`[DB] error occurred during insertion`);
                    console.error(err);
                })
                .finally(() => {
                    this.dbMutex.unlock();
                })
        });
    }

    /**
     * Checks if a table exists for the user, if not creates it
     * @param username Username of the user
     */
    public static async touchUserTable(username: string) {
        let tableExists = await this.dbClient.schema.hasTable(username);
        if (!tableExists)
            this.createUserTable(username);
    }

    /**
     * Creates a table for the user
     * @param username Username of the user
     */
    private static createUserTable(username: string) {
        //FIXME: change columns with real data we retrieve
        console.log(`[DB] creating table for user ${username}`);
        this.dbClient.schema.createTable(username, tableBuilder => {
            tableBuilder.float("temperature");
            tableBuilder.float("humidity");
            tableBuilder.timestamp("timestamp").defaultTo(this.dbClient.fn.now()).primary();
            tableBuilder.unique(["timestamp"]);
        }).then(result => {
            console.log(`[DB] created table for user ${username}`);
        })
    }
}

DbManager.initialize();

export default DbManager;
