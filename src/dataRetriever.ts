/**
 * This module provides data to the analyzer
 */

class DataRetriever {
    public static initialize(){
        console.log("[RETRIEVER] initializing");
        this.readData = this.readData.bind(this);
    }

    private static readData(){
        // Read data from sensors and update cache
    }

    public static get data(){
        // Refresh data
        this.readData();
        // send data back to those who requested
        return null;
    }
}

DataRetriever.initialize();

export default DataRetriever;