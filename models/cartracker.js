const CarTrackerService = require('../services/cartracker-service.js');
const polyline = require('@mapbox/polyline');
const spawn = require('threads').spawn;
const maps = require('@google/maps').createClient({
    key: 'AIzaSyBECZDHHuxDsGezIfvZG2vEtAdLBz1B10I'
});

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

    /**
     * Start route from a given origin and destination
     * @param origin is the start of the route in a LatLng string format
     * @param destination is the destination of the route in a LatLng string format
     */
    startRoute(origin, destination) {

        maps.directions({origin: origin, destination: destination, mode: "driving"}, function (err, response) {
            if (!err) {

                const polylinePoints = response.json.routes[0].overview_polyline.points;
                const latLongArray = polyline.decode(polylinePoints);

                for (let latLong of latLongArray) {
                    console.log(latLong);
                    const carTracker = new CarTracker(this.id, this.manufacturer, latLong);
                }

            }
        });
    }
}

module.exports = CarTracker;