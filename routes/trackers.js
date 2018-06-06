const express = require('express');
const router = express.Router();

const CarTracker = require('../models/cartracker.js');
const Location = require('../models/location.js');
const CarTrackerService = require('../services/cartracker-service.js');
const DisplacementService = require('../services/displacement-service.js');
const polyline = require('@mapbox/polyline');
const maps = require('@google/maps').createClient({
    key: 'AIzaSyBECZDHHuxDsGezIfvZG2vEtAdLBz1B10I'
});

/**
 * POST: Add new car to the system
 */
router.post('/', function (req, res, next) {

    const manufacturer = req.body.manufacturer;
    const id = req.body.id;

    let newCarTracker = new CarTracker(id, false, manufacturer, new Location(null, null), 0);
    res.send(CarTrackerService.save(newCarTracker).then(result => console.log(result)));

});

/**
 * Get all cars in the database
 */
router.get('/', function (req, res, next) {

    CarTrackerService.getAll().then(function (snapshot) {
        const carTrackers = [];
        snapshot.forEach(function (doc) {
            const data = doc.data();
            carTrackers.push(new CarTracker(doc.id, data.isDriving, data.manufacturer, data.lastLocation, data.metersDriven));
        });
        res.send(carTrackers);
    });

});

/**
 * GET: Find a specific car
 */
router.get('/:id', function (req, res, next) {

    const id = req.params.id;

    CarTrackerService.findById(id).then(function (doc) {
        if (doc.exists) {
            const data = doc.data();
            res.send(new CarTracker(doc.id, data.isDriving, data.manufacturer, data.lastLocation, data.metersDriven));
        } else {
            res.status(404).send('Requested CarTracker has not been found');
        }
    });

});

/**
 * DELETE: Deletes a CarTracker from the database
 */
router.delete('/:id', function (req, res, next) {
    const id = req.params.id;
    res.send(CarTrackerService.deleteById(id));
});

/**
 * GET: START new route for specific CarTracker
 */
router.get('/:id/start', function (req, res, next) {

    const id = req.params.id;
    const origin = req.query.origin;
    const destination = req.query.destination;

    CarTrackerService.findById(id).then(function (doc) {
        if (doc.exists) {
            startRoute(doc.id, origin, destination);
            res.send('CarTracker ' + id + ' started driving from ' + origin + " to " + destination + ".");
        } else {
            res.status(404).send('Requested CarTracker has not been found');
        }
    });

});

/**
 * Start route from a given origin and destination
 * @param origin is the start of the route in a LatLng string format
 * @param destination is the destination of the route in a LatLng string format
 */
function startRoute(id, origin, destination) {

    maps.directions({origin: origin, destination: destination, mode: "driving"}, function (err, response) {
        if (!err) {

            const distance = response.json.routes[0].legs[0].distance.value;
            const duration = response.json.routes[0].legs[0].duration.value;
            const polylinePoints = response.json.routes[0].overview_polyline.points;
            const latLongArray = polyline.decode(polylinePoints);
            const timeBetweenLatLong = Math.round((duration / latLongArray.length));
            const metersBetweenLatLong = Math.round(distance / latLongArray.length);

            const latLong = latLongArray.shift();
            const newLocation = new Location(latLong[0], latLong[1]);
            CarTrackerService.updateCarTracker(id, newLocation, metersBetweenLatLong);
            DisplacementService.pushCarTrackerRule(id, newLocation.lat, newLocation.lng, metersBetweenLatLong);

            const updateLocationInterval = setInterval(function () {
                const latLong = latLongArray.shift();
                if (latLong != null) {
                    const newLocation = new Location(latLong[0], latLong[1]);
                    if (CarTrackerService.updateCarTracker(id, newLocation, metersBetweenLatLong) === false) {
                        clearInterval(updateLocationInterval);
                    }
                    else {
                        DisplacementService.pushCarTrackerRule(id, newLocation.lat, newLocation.lng, metersBetweenLatLong);
                    }
                }
                else {
                    CarTrackerService.stopDriving(id);
                    clearInterval(updateLocationInterval);
                }
            }, (timeBetweenLatLong * 1000));

        }
    });
}

module.exports = router;
