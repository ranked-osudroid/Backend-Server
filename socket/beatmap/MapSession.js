import { UserConnection } from "#socketConnection";
import { Socket } from "socket.io";

export default class MapSession {

    /** 
     * Key : mapSessionID
     * Value : MapSession class
     * @type {Map<string, MapSession>} 
     */
    static mapSessions = new Map();

    /**
     * 모든 플레이 세션 목록들을 담은 Map 인스턴스를 반환 하는 Getter 메소드 입니다.
     * @returns {Map<string, MapSession>}
     */
    static getMapSessions() {
        return this.mapSessions;
    }

    /** @type {UserConnection} */
    owner;

    /** @type {Number} */
    startTime;

    /** @type {Number} */
    mapId;

    /** @type {Array<Socket>} */
    listeners;

    /** @type {Array<Position>} */
    positions;

    /** @type {Number} */
    resWidth;

    /** @type {Number} */
    resHeight;

    /**
     * @param {UserConnection} owner 세션의 주인 커넥션
     * @param {Number} startTime 시작한 시간
     * @param {Number} mapId 맵 아이디
     * @param {Number} resWidth 클라이언트 디바이스 해상도 가로 길이
     * @param {Number} resHeight 클라이언트 디바이스 해상도 세로 길이
     */
    constructor(owner, startTime, mapId, resWidth, resHeight) {
        this.owner = owner;
        this.startTime = startTime;
        this.mapId = mapId;
        this.resWidth = resWidth;
        this.resHeight = resHeight;
        this.listeners = [];
        this.positions = [];
    }

    /**
     * 이 맵의 업데이트 정보를 받을 소켓 세션을 추가 합니다.
     * @param {Socket} socket 정보를 받을 소켓 세션
     */
    addListener(socket) {
        this.listeners.push(socket);
    }

    /**
     * 이 맵의 업데이트 정보를 더이상 받지 않습니다.
     * @param {Socket} socket 연결을 끊을 소켓 세션
     */
    removeListener(socket) {
        if(this.listeners.includes(socket)) {
            let index = this.listeners.indexOf(socket);
            delete this.listeners[index];
        }
    }

    /**
     * 커서 포지션을 추가합니다.
     * @param {Position} position 커서 포지션
     */
    async addPosition(position) {
        // 커서 정보 추가
        this.positions.push(position);

        // 이 맵을 플레이 하고 있는 모든 사람에게
        const data = position.asJson();
        for(let socket of this.listeners) {
            socket.emit('position_update', data);
        }
    }
}