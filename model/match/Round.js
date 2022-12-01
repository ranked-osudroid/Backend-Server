import Result from "./Result.js";

export default class Round {

    /** @type {number} */
    startedTime;
    
    /** @type {number} */
    mapId;

    /** @type {number} */
    mapSet;

    /** @type {Result} */
    blueResult;

    /** @type {Result} */
    redResult;

    /**
     * @param {object} object
     * @param {number} object.startedTime
     * @param {number} object.mapId;
     * @param {number} object.mapSet;
     * @param {Result} object.blueResult;
     * @param {Result} object.redResult;
     */
    constructor(object) {
        this.startedTime = object.startedTime;
        this.mapId = object.mapId;
        this.mapSet = object.mapSet;
        this.blueResult = object.blueResult;
        this.redResult = object.redResult;
    }

    toJson() {
        return {
            startedTime, mapId, mapSet,
            blueResult: this.blueResult.toJson(),
            redResult: this.redResult.toJson()
        };
    }



}