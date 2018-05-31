const WebSocket = require('ws');
const socket = new WebSocket.Server({port: 8082, host: "0.0.0.0"});

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