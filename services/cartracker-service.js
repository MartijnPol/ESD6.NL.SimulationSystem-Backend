const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
    projectId: 'simulationsystem-1524652497697',
    keyFilename: 'firestore-keys.json',
});

const collectionPath = 'CarTrackers';

class CartrackerService {

    /**
     * Function to add a given CarTracker to Firestore
     * @param CarTracker is the CarTracker object that needs to be saved
     */
    static save(CarTracker) {
        return firestore.collection(collectionPath).doc(CarTracker.id).set({
            manufacturer: CarTracker.manufacturer,
            lastLocation: JSON.parse(JSON.stringify(CarTracker.lastLocation))
        }).then(function (error) {
            console.log(error);
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
     * Function to delete a specific CarTracker by it's id
     * @param id of the CarTracker
     */
    static deleteById(id) {
        return firestore.collection(collectionPath).doc(id).delete();
    }
}

module.exports = CartrackerService;