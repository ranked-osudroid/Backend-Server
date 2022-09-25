import { socketServer } from '#server';
import { Position, MapSession } from './model/index.js';

const mapSocketIdToName = {

};

const mapNameToSocketId = {

};

const mapSessions = {

};

export default function init() {
    socketServer.on('connection', (socket) => {

        console.log(`Client connected! ${socket.id}`);

        socket.on('disconnect', () => {
            const username = mapSocketIdToName[socket.id];
            delete mapNameToSocketId[username];
            delete mapSocketIdToName[socket.id];
            console.log(`Client(${socket.id}) (${username}) disconnected!`);
        });

        socket.on('session_sync', (username) => {
            mapSocketIdToName[socket.id] = username;
            mapNameToSocketId[username] = socket.id;
            console.log(`Client(${socket.id}) is binded as ${username} !`);
        });

        socket.on('message', (message) => {
            console.log(`Client (${socket.id}) : ${message}`);
        });

        socket.on('cursor_press', (mapId, time, i, x, y) => {
            const mapSession = mapSessions[socket.id];
            if(mapSession == undefined) {
                return;
            }
            console.log(`Client(${socket.id}) Cursor Press Event on Beatmap(${mapId}) | time : ${time} | i : ${i} | x : ${x} | y : ${y}`);
            mapSession.addPosition(new Position("press", time, i, x, y));
        });

        socket.on('cursor_move', (mapId, time, i, x, y) => {
            const mapSession = mapSessions[socket.id];
            if(mapSession == undefined) {
                return;
            }
            console.log(`Client(${socket.id}) Cursor Move Event on Beatmap(${mapId}) | time : ${time} | i : ${i} | x : ${x} | y : ${y}`);
            mapSession.addPosition(new Position("move", time, i, x, y));
        });

        socket.on('cursor_release', (mapId, time, i) => {
            const mapSession = mapSessions[socket.id];
            if(mapSession == undefined) {
                return;
            }
            console.log(`Client(${socket.id}) Cursor Release Event on Beatmap(${mapId}) | time : ${time} | i : ${i}`);
            mapSession.addPosition(new Position("release", time, i));
        });

        socket.on('map_start', async (mapId, time, resWidth, resHeight) => {
            console.log(`Client(${socket.id}) has started playing a map(${mapId})! | time : ${time} | resWidth : ${resWidth} | resHeight : ${resHeight}`);
            mapSessions[socket.id] = new MapSession(mapId, resWidth, resHeight);
            const clients = await socketServer.fetchSockets();
            clients.forEach(client => {
                mapSessions[socket.id].addListener(client);
                client.emit('map_start', {
                    username: mapSocketIdToName[socket.id],
                    resWidth: resWidth,
                    resHeight: resHeight,
                    mapId: mapId
                });
            });
            // mapSessions[socket.id].addListener(socket);
        });

        socket.on('map_stop', (mapId, time) => {
            console.log(`Client(${socket.id}) has stopped playing a map(${mapId})! | time : ${time}`);
            delete mapSessions[socket.id];
        });
    });
}