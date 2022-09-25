
/**
 * @typedef Position
 * @type {Object}
 * @property {String} type
 * @property {Number} time
 * @property {Number} i
 * @property {Number} x
 * @property {Number} y
 */


export default class MapSession {
    /**
     * @type {Number}
     */
    mapId;

    /**
     * @type {Array.<Socket>}
     */
    listeners;


    /**
     * @type {Array.<Position>}
     */
    positions;

    resWidth;
    resHeight;

    constructor(mapId, resWidth, resHeight) {
        this.mapId = mapId;
        this.resWidth = resWidth;
        this.resHeight = resHeight;
        this.listeners = [];
        this.positions = [];
    }

    addListener(socket) {
        this.listeners.push(socket);
    }

    /**
     * 커서 포지션을 추가합니다.
     * @param {Position} position 커서 포지션
     */
    async addPosition(position) {
        this.positions.push(position);
        const data = position.asJson();
        for(let socket of this.listeners) {
            socket.emit('position_update', data);
        }
    }
}