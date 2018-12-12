var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

const { DEVICE_NAME = "sew35038" } = process.env; // Get device name (default to SMARTEX transmitter)

interface devicesCache {
    // Contains a map of device names and MAC addresses
    [name: string]: string;
}

class BluetoothManager {
    private static devicesCache: devicesCache = {};
    private static connectionStatus: boolean = false;

    /**
     * When scanning devices, keep a cache of found devices
     * When I finished, search the device:
     *  - if I find it, connect to it
     *  - if I cannot find it, do nothing
     * Eventually, clear the cache
     */

    public static initialize() {
        this.addToCache = this.addToCache.bind(this);
        this.handleScanningEnd = this.handleScanningEnd.bind(this);
        this.handleIncomingData = this.handleIncomingData.bind(this);
    }


    private static addToCache(address: string, name: string) {
        console.log("[BLUETOOTH] found device");
        this.devicesCache[name] = address;
        console.log(`[BLUETOOTH] found ${name} on ${address}`);
    }

    private static handleScanningEnd() {
        console.log("[BLUETOOTH] finished scanning devices");
        if (this.devicesCache != {} && DEVICE_NAME in this.devicesCache) {

            let address = this.devicesCache[DEVICE_NAME];

            console.log("[BLUETOOTH] the shirt has been discovered");
            console.log(`[BLUETOOTH] its address is ${address}`);

            btSerial.findSerialPortChannel(address, function (channel) {
                btSerial.connect(address, channel, function () {
                    console.log('[BLUETOOTH] succesfully connected to the shirt');

                    BluetoothManager.connectionStatus = true;

                    btSerial.on('data', BluetoothManager.handleIncomingData);

                }, function () {
                    console.log('[BLUETOOTH] cannot connect to the shirt');
                });

            }, function () {
                console.log('[BLUETOOTH] cannot find port');
            });
        }
        else {
            //Device has not been found
            console.log("[BLUETOOTH] device was not found");
        }
        this.clearCache();
    }

    private static clearCache() {
        Object.keys(this.devicesCache).forEach(device => {
            delete this.devicesCache[device];
        });
    }

    private static handleIncomingData(buffer: any) {
        console.log("[BLUETOOTH] I received data");
        let data = buffer.toString('utf-8');
    }

    public static get connected() {
        return this.connectionStatus;
    }

    public static connect() {
        if (!this.connected) {

            btSerial
                .on('finished', this.handleScanningEnd)
                .on('found', this.addToCache);
            btSerial.inquire();
            console.log("[BLUETOOTH] started scanning")
        }
    }

}

BluetoothManager.initialize();

export default BluetoothManager;