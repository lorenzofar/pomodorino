import * as moment from "moment";
import DataPoint from "./models/dataPoint";

import * as dhtSensor from "node-dht-sensor";

/**
 * This module provides data to the analyzer
 */

const SENSOR_PIN = 5;

class DataRetriever {

    private static dataCache: DataPoint = null;


    public static initialize() {
        console.log("[RETRIEVER] initializing");
        this.readData = this.readData.bind(this);
    }

    private static readData() {
        // Read data from sensors and update cache
        //TODO: Pass data point to dbManager
        // TODO: Pass data point to socket manager
        
        dhtSensor.read(11, SENSOR_PIN, (err, temperature: number, humidity: number) => {
            if (err) return;
            let now = moment(); // Get current datetime
            let dp: DataPoint = {
                timestamp: now.unix(),
                data: {
                    "temperature": temperature,
                    "humidity": humidity
                }
            }
            this.dataCache = dp;
        });

    }

    public static get data(): DataPoint {
        /**
         * This method triggers an update of the data cache and return its content
         * FIXME: This could however bring issues as it would not provide the most recent data point 
         * but instead the (N-1)th
         */
        this.readData();
        return this.dataCache;
    }
}

DataRetriever.initialize();

export default DataRetriever;