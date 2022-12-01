export default class Result {
    
    /** @type {string} */
    playId;

    /** @type {number} */
    perfectX;

    /** @type {number} */
    perfect;

    /** @type {number} */
    greatX;

    /** @type {number} */
    great;

    /** @type {number} */
    good;

    /** @type {number} */
    miss;

    /** @type {number} */
    score;

    /** @type {number} */
    acc;

    /** @type {string} */
    rank;

    /** @type {Array<string>} */
    modList;

    /** @type {number} */
    maxCombo;

    /**
     * @param {object} object MongoDB 에 있는 Record schema
     */
    constructor(object) {
        this.playId = object.id;
        this.perfectX = object.perfectX;
        this.perfect = object.perfect;
        this.greatX
    }

    toJson() {
        return {
            playId, perfectX, prefect, greatX, great, good, miss, score, acc, rank, modList, maxCombo
        };
    }

}