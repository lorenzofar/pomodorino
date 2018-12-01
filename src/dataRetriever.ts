/**
 * This module provides data to the analyzer
 */

 //FIXME: Change interface to reflect real structure of data to retrieve
interface dataPoint{
    light: number;
    noise: number;
}

class DataRetriever {
    private static readData(){
        
    }

    public static get data(){
        // send data back to those who requested
        return null;
    }
}

export default DataRetriever;