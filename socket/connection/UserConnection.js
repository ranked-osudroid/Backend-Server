import { Socket } from "socket.io";

export default class UserConnection {

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