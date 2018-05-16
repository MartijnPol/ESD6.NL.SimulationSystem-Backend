class ZipcodeRandomizer {

    /**
     * Constructor for initializing dataset
     */
    constructor() {
        this.zipCodes = ["3711AZ", "3527HX", "5014HA", "6132GC", "6681TH", "5025ER", "5051RA", "9751BB", "3993XC", "6706LB", "5211BD"];
    }

    /**
     * Get random zipcode from dataset
     */
    getRandomZipcode() {
        return this.zipCodes[Math.floor(Math.random() * this.zipCodes.length)];
    }

}

module.exports = ZipcodeRandomizer;