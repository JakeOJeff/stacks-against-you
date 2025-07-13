import { WebSocketServer } from 'ws';
import { parties } from './party';

const wss = new WebSocketServer({ noServer: true });

// This will be handled by Next.js's server
export default function handler(req, res) {
  if (!res.socket.server.wss) {
    res.socket.server.wss = wss;
    
    wss.on('connection', (ws, req) => {
      const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
      const code = searchParams.get('code');
      
      if (!parties[code]) {
        ws.close();
        return;
      }

      // Send initial party data
      ws.send(JSON.stringify({
        type: 'update',
        players: parties[code].players,
        countdown: parties[code].selfDestructTimeout ? 60 : null
      }));

      // Broadcast updates to all clients when party changes
      const broadcastUpdate = () => {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'update',
              players: parties[code].players,
              countdown: parties[code].selfDestructTimeout ? 60 : null
            }));
          }
        });
      };

      const interval = setInterval(broadcastUpdate, 1000);
      
      ws.on('close', () => {
        clearInterval(interval);
      });
    });
  }

  // Handle the upgrade
  res.socket.server.wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    res.socket.server.wss.emit('connection', ws, req);
  });
  
  res.end();
}