import Round from './Round.js';

export default class Match {
    
    /** @type {string} */
    id;

    /** @type {number} */
    startedTime;

    /** @type {number} */
    endedTime;

    /** @type {string} */
    blueUUID;

    /** @type {string} */
    redUUID;

    /** @type {number} */
    blueScore;

    /** @type {number} */
    redScore;

    /** @type {string} */
    mappool;

    /** @type {boolean} */
    aborted;

    /** @type {Array<Round>} */
    rounds;

    /**
     * @param {object} object
     * @param {string} object.id
     * @param {number} object.startedTime
     * @param {number=} object.endedTime
     * @param {string} object.blueUUID
     * @param {string} object.redUUID
     * @param {number=} object.blueScore
     * @param {number=} object.redScore
     * @param {string=} object.mappool
     * @param {aborted=} object.aborted
     * @param {Array<Round>=} object.rounds
     */
    constructor(object) {
        this.id = object.id;
        this.startedTime = object.startedTime;
        this.endedTime = object.endedTime ?? -1;
        this.blueUUID = object.blueUUID;
        this.redUUID = object.redUUID;
        this.blueScore = object.blueScore ?? 0;
        this.redScore = object.redScore ?? 0;
        this.mappool = object.mappool ?? null;
        this.aborted = object.aborted ?? false;
        this.rounds = object.rounds ?? [];
    }


    static getFromDatabase(id) {
        
    }

    /**
     * @param {string} mappoolUUID 
     */
    setMappool(mappoolUUID) {
        this.mappool = mappoolUUID;
    }

    /**
     * @param {boolean} aborted 
     */
    setAborted(aborted) {
        this.aborted = aborted;
    }

    /**
     * 매치에 라운드를 추가 합니다.
     * @param {Round} round 추가할 라운드 인스턴스
     */
    addRound(round) {
        this.rounds.push(round);
    }

    toJson() {
        let jsonRounds = [];
        for(let round of this.rounds) {
            jsonRounds.push(round.toJson());
        }
        return {
            id, startedTime, endedTime, blueUUID, redUUID, blueScore, redScore, mappool, aborted, rounds: jsonRounds
        }
    }

    



}