import { socketServer } from '#server';
import { Position, MapSession } from '#socketBeatmap';
import { UserConnection } from '#socketConnection';
import { StringUtils } from '#utils';

export default function init() {
    socketServer.on('connection', (socket) => {

        console.log(`Client connected! ${socket.id}`);

        socket.on('disconnect', () => {
            const connection = UserConnection.getConnections().get(socket.id);
            if(connection === undefined) {
                console.log(`DisConnect from ${connection.toString()}`);
                return;
            }
            console.log(`Client(${socket.id}) disconnected!`);
            UserConnection.getConnections().delete(socket.id);

            /*
             * 플레이어 하나가 나갔다는 것을 모든 소켓에게 알림
             */
            UserConnection.getConnections().forEach((value, key) => {
                value.getRawSocket().emit('leave_connection', username);
            });

        });

        socket.on('session_sync', async (username) => {
            let userConnection = new UserConnection(username, socket);
            UserConnection.getConnections().set(socket.id, userConnection);
            console.log(`Client(${socket.id}) is binded as ${username} !`);

            /*
             * 새로운 플레이어가 들어왔다는 것을 모든 소켓에게 알림
             */
            UserConnection.getConnections().forEach((value, key) => {
                value.getRawSocket().emit("join_connection", username);
            });
            
        });

        socket.on('message', (message) => {
            console.log(`Client (${socket.id}) : ${message}`);
        });

        socket.on('cursor_press', (mapId, time, i, x, y) => {
            const userConnection = UserConnection.getConnections().get(socket.id);
            if(userConnection == undefined) {
                return;
            }
            const mapSession = MapSession.getMapSessions().get(userConnection.getOwnedMapSessionId());
            if(mapSession == undefined) {
                return;
            }
            // console.log(`Client(${socket.id}) Cursor Press Event on Beatmap(${mapId}) | time : ${time} | i : ${i} | x : ${x} | y : ${y}`);
            mapSession.addPosition(new Position("press", time, i, x, y));
        });

        socket.on('cursor_move', (mapId, time, i, x, y) => {
            const userConnection = UserConnection.getConnections().get(socket.id);
            if(userConnection == undefined) {
                return;
            }
            const mapSession = MapSession.getMapSessions().get(userConnection.getOwnedMapSessionId());
            if(mapSession == undefined) {
                return;
            }
            // console.log(`Client(${socket.id}) Cursor Move Event on Beatmap(${mapId}) | time : ${time} | i : ${i} | x : ${x} | y : ${y}`);
            mapSession.addPosition(new Position("move", time, i, x, y));
        });

        socket.on('cursor_release', (mapId, time, i) => {
            const userConnection = UserConnection.getConnections().get(socket.id);
            if(userConnection == undefined) {
                return;
            }
            const mapSession = MapSession.getMapSessions().get(userConnection.getOwnedMapSessionId());
            if(mapSession == undefined) {
                return;
            }
            // console.log(`Client(${socket.id}) Cursor Release Event on Beatmap(${mapId}) | time : ${time} | i : ${i}`);
            mapSession.addPosition(new Position("release", time, i));
        });

        socket.on('map_start', async (mapId, time, resWidth, resHeight) => {
            const userConnection = UserConnection.getConnections().get(socket.id);

            let id = StringUtils.getAlphaNumericString(7);
            while(MapSession.getMapSessions().has(id)) {
                id = StringUtils.getAlphaNumericString(7);
            }

            console.log(`${userConnection.getUserName()} has started playing a map(${mapId})! | id : ${id} | time : ${time}`);
            const mapSession = new MapSession(userConnection, time, mapId, resWidth, resHeight);
            MapSession.getMapSessions().set(id, mapSession);
            userConnection.setOwnedMapSessionId(id);
        });

        socket.on('map_stop', (mapId, time) => {
            const userConnection = UserConnection.getConnections().get(socket.id);
            const mapSessionId = userConnection.getOwnedMapSessionId();
            console.log(`${userConnection.getUserName()} has stopped playing a map(${mapId})! | id : ${mapSessionId} | time : ${time}`);
            MapSession.getMapSessions().delete(mapSessionId);
            userConnection.setOwnedMapSessionId(null);
        });
    });
}