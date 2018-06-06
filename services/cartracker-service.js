const Firestore = require('@google-cloud/firestore');
const broadcastMessage = require('../websocket');
const firestore = new Firestore({
    projectId: 'simulationsystem-1524652497697',
    keyFilename: 'firestore-keys.json',
});

const collectionPath = 'CarTrackers';

class CarTrackerService {

    /**
     * Function to add a given CarTracker to Firestore
     * @param CarTracker is the CarTracker object that needs to be saved
     */
    static save(CarTracker) {
        return firestore.collection(collectionPath).doc(CarTracker.id).set({
            manufacturer: CarTracker.manufacturer,
            isDriving: CarTracker.isDriving,
            lastLocation: JSON.parse(JSON.stringify(CarTracker.lastLocation)),
            metersDriven: 0
        }).then(function () {
            broadcastMessage("added");
        });
    }

    /**
     * Function to get all CarTrackers in Firestore
     */
    static getAll() {
        return firestore.collection(collectionPath).get();
    }

    /**
     * Function to find a specific CarTracker by it's ID
     * @param id of the CarTracker
     */
    static findById(id) {
        const docReference = firestore.collection(collectionPath).doc(id);
        return docReference.get();
    }

    /**
     * Function to update the lastLocation of a given CarTrackerId
     * @param id of the CarTracker
     * @param lastLocation is the new lastLocation of the given CarTracker
     * @param meters are the meters of the Pope
     */
    static updateCarTracker(id, lastLocation, meters) {
        this.findById(id).then(function (doc) {
            if (doc.exists) {
                const newMetersDriven = doc.data().metersDriven + meters;
                firestore.collection(collectionPath).doc(id).update({
                    isDriving: true,
                    lastLocation: JSON.parse(JSON.stringify(lastLocation)),
                    metersDriven: newMetersDriven
                }).then(function () {
                    broadcastMessage('updated');
                    return true;
                }).catch(function () {
                    return false;
                });
            }
        });
    }

    /**
     * Stop the driving status of a given CarTracker
     * @param id of the specific CarTracker
     */
    static stopDriving(id) {
        firestore.collection(collectionPath).doc(id).update({
            isDriving: false
        }).then(function () {
            broadcastMessage('updated');
        });
    }

    /**
     * Function to delete a specific CarTracker by it's id
     * @param id of the CarTracker
     */
    static deleteById(id) {
        firestore.collection(collectionPath).doc(id).delete().then(function () {
            broadcastMessage("deleted");
        });
    }
}

module.exports = CarTrackerService;