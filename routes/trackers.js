const express = require('express');
const router = express.Router();
const broadcastMessage = require('../websocket');

const CarTracker = require('../models/cartracker.js');
const Location = require('../models/location.js');
const CarTrackerService = require('../services/cartracker-service.js');

/**
 * POST: Add new car to the system
 */
router.post('/', function (req, res, next) {

    const manufacturer = req.body.manufacturer;
    const id = req.body.id;

    let newCarTracker = new CarTracker(id, false, manufacturer, new Location(null, null));
    broadcastMessage('added');
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
            carTrackers.push(new CarTracker(doc.id, data.isDriving, data.manufacturer, data.lastLocation));
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
            res.send(new CarTracker(doc.id, data.isDriving, data.manufacturer, data.lastLocation));
        } else {
            res.status(404).send('Requested document is not found.');
        }
    });

});

/**
 * DELETE: Deletes a CarTracker from the database
 */
router.delete('/:id', function (req, res, next) {

    const id = req.params.id;
    broadcastMessage('deleted');
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
            const data = doc.data();
            const carTracker = new CarTracker(doc.id, data.isDriving, data.manufacturer, data.lastLocation);
            carTracker.startRoute(origin, destination);
            res.send('CarTracker ' + id + ' started driving from ' + origin + " to " + destination + ".");
        } else {
            res.status(404).send('Requested document is not found.');
        }
    });

});

module.exports = router;
