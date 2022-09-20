import { socketServer } from '#server';

export default function init() {
    socketServer.on('connection', (socket) => {
        console.log(socket.id);
    });
}