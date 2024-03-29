import Client from "./client";
import DataPoint from "./dataPoint";

export default interface cacheEntry{
    user: Client; // Socket, admin rights and username
    data: DataPoint[]; // Collection of data points
}