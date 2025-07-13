import { WebSocketServer } from 'ws';
import { parties } from './party';

const wss = new WebSocketServer({ noServer: true });

// Store connected clients by party code
const clientsByParty = {};

export default function handler(req, res) {
  if (!res.socket.server.wss) {
    res.socket.server.wss = wss;
    
    wss.on('connection', (ws, req) => {
      const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
      const code = searchParams.get('code');
      
      if (!parties[code]) {
        ws.close(1000, 'Party not found');
        return;
      }

      // Add client to party group
      if (!clientsByParty[code]) {
        clientsByParty[code] = new Set();
      }
      clientsByParty[code].add(ws);

      // Send initial party data
      ws.send(JSON.stringify({
        type: 'update',
        players: parties[code].players,
        countdown: parties[code].selfDestructTimeout ? 
          Math.ceil((parties[code].selfDestructTimeout._idleStart + parties[code].selfDestructTimeout._idleTimeout - Date.now()) / 1000) : null
      }));

      // Broadcast updates to all clients in the party when changes occur
      const broadcastUpdate = () => {
        if (!parties[code]) return;
        
        const message = JSON.stringify({
          type: 'update',
          players: parties[code].players,
          countdown: parties[code].selfDestructTimeout ? 
            Math.ceil((parties[code].selfDestructTimeout._idleStart + parties[code].selfDestructTimeout._idleTimeout - Date.now()) / 1000) : null
        });

        clientsByParty[code]?.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      };

      // Set up periodic updates (every second)
      const interval = setInterval(broadcastUpdate, 1000);
      
      ws.on('close', () => {
        clearInterval(interval);
        clientsByParty[code]?.delete(ws);
        if (clientsByParty[code]?.size === 0) {
          delete clientsByParty[code];
        }
      });
    });
  }

  // Handle the upgrade
  res.socket.server.wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    res.socket.server.wss.emit('connection', ws, req);
  });
  
  res.end();
}