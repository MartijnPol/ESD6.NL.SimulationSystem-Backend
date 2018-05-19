class CarTracker {

    /**
     * Constructor
     */
    constructor(id, isDriving, manufacturer, lastLocation) {
        this.id = id;
        this.isDriving = isDriving;
        this.manufacturer = manufacturer;
        this.lastLocation = lastLocation;
    }

}

module.exports = CarTracker;