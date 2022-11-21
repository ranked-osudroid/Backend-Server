import { Socket } from "socket.io";

export default class UserConnection {

    /** 
     * Key : socketID
     * Value : UserConnection class
     * @type {Map<string, UserConnection>}
     */
    static connections = new Map();

    /**
     * 모든 커넥션 목록들을 담은 Map 인스턴스를 반환 하는 Getter 메소드 입니다.
     * @returns {Map<string, UserConnection>}
     */
    static getConnections() {
        return this.connections;
    }

    /** @type {string} */
    userName;

    /** @type {Socket} */
    rawSocket;

    /** @type {string} */
    ownedMapSessionId;

    /**
     * @param {string} userName 
     * @param {Socket} rawSocket 
     */
    constructor(userName, rawSocket) {
        this.userName = userName;
        this.rawSocket = rawSocket;
        this.ownedMapSession = null;
    }

    /**
     * @returns {string} 
     */
    getUserName() {
        return this.userName;
    }

    /**
     * @returns {Socket}
     */
    getRawSocket() {
        return this.rawSocket;
    }

    /**
     * @returns {string}
     */
    getOwnedMapSessionId() {
        return this.ownedMapSessionId;
    }

    /**
     * @param {string} ownedMapSessionId
     */
    setOwnedMapSessionId(ownedMapSessionId) {
        this.ownedMapSessionId = ownedMapSessionId;
    }

    /**
     * @returns {string}
     */
    toString() {
        return `UserConnection{userName = ${this.userName}, socket = ${this.rawSocket.id}, ownedMapSessionId = ${this.ownedMapSessionId}}`;
    }

}