const express = require('express');
const router = express.Router();

/**
 * Renders the home page when requested
 */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'SimulationSystem Backend'});
});

module.exports = router;
