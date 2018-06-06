const unirest = require('unirest');

class DisplacementService {

    /**
     * Push data to DisplacementSystem
     * @param id is the id of the CarTracker
     * @param lat is the new latitude location
     * @param lon is the new longitude location
     * @param metersDriven is the amount of metersDriven
     */
    static pushCarTrackerRule(id, lat, lon, metersDriven) {
        unirest.post('http://localhost:8080/DisplacementSystem/api/CarTrackers/AddRule')
            .headers({'Content-Type': 'application/json'})
            .send({
                "id": id,
                "lat": lat,
                "lon": lon,
                "date": new Date(),
                "mdriven": metersDriven
            })
            .end(function () {
                console.log('Pushed data to DisplacementSystem');
            });
    }

}

module.exports = DisplacementService;