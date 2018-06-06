class CarTracker {

    /**
     * Constructor
     */
    constructor(id, isDriving, manufacturer, lastLocation, metersDriven) {
        this.id = id;
        this.isDriving = isDriving;
        this.manufacturer = manufacturer;
        this.lastLocation = lastLocation;
        this.metersDriven = metersDriven;
    }

}

module.exports = CarTracker;