const maps = require('@google/maps').createClient({
    key: 'AIzaSyBECZDHHuxDsGezIfvZG2vEtAdLBz1B10I'
});
const polyline = require('@mapbox/polyline');

class CarTracker {

    /**
     * Constructor
     */
    constructor(id, isDriving, manufacturer, currentLocation) {
        this.id = id;
        this.isDriving = isDriving;
        this.manufacturer = manufacturer;
        this.currentLocation = currentLocation;
    }

    /**
     * Start route from a given origin and destination
     * @param origin is the start of the route in a LatLng string format
     * @param destination is the destination of the route in a LatLng string format
     */
    startRoute(origin, destination) {
        this.driving = true;
        const latLongs = this.getLocationsInRoute(origin, destination);
        console.log(latLongs);
    }

    getLocationsInRoute(origin, destination) {
        maps.directions({
            origin: origin,
            destination: destination,
            mode: "driving"
        }, function (err, response) {
            if (!err) {
                const polylinePoints = response.json.routes[0].overview_polyline.points;
                return polyline.decode(polylinePoints);
            }
        });
    }
}

module.exports = CarTracker;