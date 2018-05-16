const express = require('express');
const router = express.Router();
const CarTracker = require('../models/cartracker.js');
const CarTrackerService = require('../services/cartracker-service.js');

/**
 * POST: Add new car to the system
 */
router.post('/', function (req, res, next) {
    const manufacturer = req.body.manufacturer;
    const id = req.body.id;
    let newCarTracker = new CarTracker(id, false, manufacturer, null);
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
            carTrackers.push(new CarTracker(doc.id, data.isDriving, data.manufacturer, data.currentLocation));
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
            res.send(new CarTracker(doc.id, data.isDriving, data.manufacturer, data.currentLocation));
        } else {
            res.status(404).send('Requested document is not found.');
        }
    });
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
            const carTracker = new CarTracker(doc.id, data.isDriving, data.manufacturer, data.currentLocation);
            carTracker.startRoute(origin, destination);
            res.send('CarTracker ' + id + ' started driving from ' + origin + " to " + destination + ".");
        } else {
            res.status(404).send('Requested document is not found.');
        }
    });
});

module.exports = router;