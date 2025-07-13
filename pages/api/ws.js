import { WebSocketServer } from 'ws';
import { parties } from './party';

let wss;

export default function handler(req, res) {
  if (!wss) {
    wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws, req) => {
      const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
      const code = searchParams.get('code').toUpperCase();
      const name = searchParams.get('name');

      if (!parties[code]) {
        ws.close(1000, 'Party not found');
        return;
      }

      // Add to party connections
      parties[code].connections.add(ws);

      // Send current player list
      ws.send(JSON.stringify({
        type: 'player_list',
        players: parties[code].players
      }));

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          
          if (data.type === 'chat_message') {
            // Broadcast to all in party
            parties[code].connections.forEach(client => {
              if (client !== ws && client.readyState === ws.OPEN) {
                client.send(JSON.stringify({
                  type: 'chat_message',
                  player: name,
                  content: data.content,
                  timestamp: new Date().toISOString()
                }));
              }
            });
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      ws.on('close', () => {
        parties[code]?.connections.delete(ws);
      });
    });
  }

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