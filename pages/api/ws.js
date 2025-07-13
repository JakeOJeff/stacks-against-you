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

      parties[code].sockets.add(ws);
      ws.send(JSON.stringify({ 
        type: 'player_list', 
        players: parties[code].players 
      }));

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          if (data.type === 'chat') {
            parties[code].sockets.forEach(client => {
              if (client !== ws) {
                client.send(JSON.stringify({
                  type: 'chat',
                  from: name,
                  message: data.message
                }));
              }
            });
          }
        } catch (error) {
          console.error('Message error:', error);
        }
      });

      ws.on('close', () => {
        parties[code]?.sockets.delete(ws);
      });
    });
  }

  if (req.headers.upgrade === 'websocket') {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    res.status(426).send('WebSocket only');
  }
}