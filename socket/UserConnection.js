import { Socket } from "socket.io";

export default class UserConnection {

    /** @type {string} */
    userName;

    /** @type {Socket} */
    rawSocket;

    /** @type {string} */
    socketId;

    /**
     * @param {string} userName 
     * @param {Socket} rawSocket 
     */
    constructor(userName, rawSocket) {
        this.userName = userName;
        this.rawSocket = rawSocket;
        this.socketId = rawSocket.id
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
    getSocketId() {
        return this.socketId;
    }

}