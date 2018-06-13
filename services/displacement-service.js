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
        unirest.get('http://192.168.25.122:77/DisplacementSystem/api/authenticate/XD2DZafI3eq1Pg7fnYF1').end(function(res) {
            let JwtToken = res.body["Token"];
            unirest.post('http://192.168.25.122:77/DisplacementSystem/api/CarTrackers/AddRule')
                .headers({'Content-Type': 'application/json'},{'Authentication': 'Bearer'+JwtToken})
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
        });

    }

}

module.exports = DisplacementService;