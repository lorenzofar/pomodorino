import * as knex from "knex";

import DataPoint from "./models/dataPoint";

const config = {
    client: 'pg',
    connection: process.env.DATABASE_URL
}

class DbManager {

    private static dbClient: knex;

    public static initialize() {
        this.dbClient = knex(config);

        /* ===== BINDINGS ===== */
        this.touchUserTable = this.touchUserTable.bind(this);
        this.createUserTable = this.createUserTable.bind(this);
    }

    public static insertDataPoint(dataPoint: DataPoint) {

    }

    /**
     * Checks if a table exists for the user, if not creates it
     * @param username Username of the user
     */
    public static async touchUserTable(username: string) {
        let tableExists = await this.dbClient.schema.hasTable(username);
        console.log(tableExists);
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
            tableBuilder.float("light");
            tableBuilder.float("noise");
            tableBuilder.timestamp("timestamp").defaultTo(this.dbClient.fn.now()).primary();
            tableBuilder.unique(["timestamp"]);
        }).then(result => {
            console.log(`[DB] created table for user ${username}`);
        })
    }
}

DbManager.initialize();

export default DbManager;