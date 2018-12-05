import * as moment from "moment";
import DataPoint from "./models/dataPoint";

/**
 * This module provides data to the analyzer
 */

class DataRetriever {

    private static dataCache: DataPoint = null;


    public static initialize(){
        console.log("[RETRIEVER] initializing");
        this.readData = this.readData.bind(this);
    }

    private static readData(){
        // Read data from sensors and update cache
        //TODO: Pass data point to dbManager
        // TODO: Pass data point to socket manager
        let now = moment(); // Get current datetime
        let dp: DataPoint = {
            timestamp: now.unix(),
            data: {
                "light": 34,
                "noise": 31
            }
        }
        this.dataCache = dp;

    }

    public static get data(): DataPoint{
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