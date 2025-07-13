import { WebSocketServer } from 'ws';

// This will store our WebSocket server instance
let wss;

export default function handler(req, res) {
  if (!wss) {
    // Initialize WebSocket server on first call
    wss = new WebSocketServer({ noServer: true });
    
    wss.on('connection', (ws) => {
      console.log('New WebSocket connection');
      
      ws.on('message', (message) => {
        // Broadcast to all clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === 1) { // 1 = OPEN
            client.send(message.toString());
          }
        });
      });
    });
  }

  // Handle the WebSocket upgrade request
  if (req.method === 'GET' && req.headers.upgrade === 'websocket') {
    res.socket.server.wss = wss;
    res.socket.server.wss.handleUpgrade(
      req,
      req.socket,
      Buffer.alloc(0),
      (ws) => {
        wss.emit('connection', ws, req);
      }
    );
    res.end();
  } else {
    res.status(426).send('Upgrade required');
  }
}