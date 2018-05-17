const WebSocket = require('ws');
const socket = new WebSocket.Server({port: 3500});

/**
 * Broadcast a message to all active listeners
 * @param message is the message you want to broadcast
 */
function broadcastMessage(message) {
    socket.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}

module.exports = broadcastMessage;