// In-memory storage
const parties = {};
const playerSessions = {};
const clientsByParty = {};

// Helper functions
const generateCode = () => Math.random().toString(36).substring(2, 7).toUpperCase();
const generateToken = () => Math.random().toString(36).substring(2);

// Broadcast updates to all connected clients
const broadcastUpdate = (code) => {
  if (!parties[code] || !clientsByParty[code]) return;

  const message = JSON.stringify({
    type: 'update',
    host: parties[code].host,
    players: parties[code].players,
    countdown: parties[code].selfDestructTimeout 
      ? Math.ceil((parties[code].selfDestructTimeout._idleStart + 
                  parties[code].selfDestructTimeout._idleTimeout - 
                  Date.now()) / 1000)
      : null
  });

  clientsByParty[code].forEach(client => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(message);
    }
  });
};

export default async function handler(req, res) {
  const { method } = req;

  // Handle POST requests
  if (method === 'POST') {
    const { type, code, name } = req.body;
    const cookies = req.headers.cookie || '';
    const sessionToken = cookies.split('session_token=')[1]?.split(';')[0];

    try {
      // Host creates new party
      if (type === 'host') {
        if (!name) {
          return res.status(400).json({ error: 'Name is required' });
        }

        const newCode = generateCode();
        const hostToken = generateToken();
        const sessionId = generateToken();

        parties[newCode] = {
          host: name,
          players: [name],
          hostToken,
          selfDestructTimeout: null,
          createdAt: Date.now()
        };

        playerSessions[sessionId] = { 
          code: newCode, 
          name, 
          isHost: true 
        };

        res.setHeader('Set-Cookie', [
          `session_token=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
          `host_token=${hostToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
        ]);

        return res.status(200).json({ 
          code: newCode,
          host: name,
          players: [name]
        });
      }

      // Player joins existing party
      if (type === 'join') {
        if (!code || !name) {
          return res.status(400).json({ error: 'Code and name are required' });
        }

        const partyCode = code.toUpperCase();
        
        if (!parties[partyCode]) {
          return res.status(404).json({ error: 'Party not found. Please check the code.' });
        }

        // Prevent duplicate names
        if (parties[partyCode].players.includes(name)) {
          return res.status(409).json({ error: 'Name already taken in this party' });
        }

        const sessionId = generateToken();
        parties[partyCode].players.push(name);
        playerSessions[sessionId] = { 
          code: partyCode, 
          name, 
          isHost: false 
        };

        res.setHeader('Set-Cookie', 
          `session_token=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
        );

        broadcastUpdate(partyCode);
        
        return res.status(200).json({ 
          code: partyCode,
          host: parties[partyCode].host,
          players: parties[partyCode].players
        });
      }

      // Host leaves (starts self-destruct)
      if (type === 'host-left') {
        if (!sessionToken || !playerSessions[sessionToken] || !playerSessions[sessionToken].isHost) {
          return res.status(403).json({ error: 'Not authorized' });
        }

        const partyCode = playerSessions[sessionToken].code;
        
        if (!parties[partyCode] || parties[partyCode].selfDestructTimeout) {
          return res.status(200).json({ message: 'Already leaving' });
        }

        parties[partyCode].selfDestructTimeout = setTimeout(() => {
          delete parties[partyCode];
          if (clientsByParty[partyCode]) {
            clientsByParty[partyCode].forEach(client => client.close());
            delete clientsByParty[partyCode];
          }
        }, 60 * 1000);

        broadcastUpdate(partyCode);
        return res.status(200).json({ message: 'Self-destruct initiated' });
      }

      // Player leaves
      if (type === 'leave') {
        if (!sessionToken || !playerSessions[sessionToken]) {
          return res.status(403).json({ error: 'Not authorized' });
        }

        const { code: partyCode, name: playerName, isHost } = playerSessions[sessionToken];
        
        if (parties[partyCode]) {
          parties[partyCode].players = parties[partyCode].players.filter(p => p !== playerName);
          
          // If host leaves without starting self-destruct
          if (isHost && !parties[partyCode].selfDestructTimeout) {
            parties[partyCode].selfDestructTimeout = setTimeout(() => {
              delete parties[partyCode];
              if (clientsByParty[partyCode]) {
                clientsByParty[partyCode].forEach(client => client.close());
                delete clientsByParty[partyCode];
              }
            }, 60 * 1000);
          }
          
          broadcastUpdate(partyCode);
        }

        delete playerSessions[sessionToken];
        return res.status(200).json({ message: 'Left party' });
      }

      return res.status(400).json({ error: 'Invalid request type' });

    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Handle GET requests (get party info)
  if (method === 'GET') {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Party code is required' });
    }

    const partyCode = code.toUpperCase();
    
    if (!parties[partyCode]) {
      return res.status(404).json({ error: 'Party not found' });
    }

    return res.status(200).json({
      host: parties[partyCode].host,
      players: parties[partyCode].players,
      countdown: parties[partyCode].selfDestructTimeout 
        ? Math.ceil((parties[partyCode].selfDestructTimeout._idleStart + 
                    parties[partyCode].selfDestructTimeout._idleTimeout - 
                    Date.now()) / 1000)
        : null
    });
  }

  // Handle WebSocket upgrades
  if (method === 'UPGRADE') {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const code = searchParams.get('code')?.toUpperCase();

    if (!code || !parties[code]) {
      res.socket.end();
      return;
    }

    // Handle the WebSocket upgrade
    res.socket.server.wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      res.socket.server.wss.emit('connection', ws, req, code);
    });

    return;
  }

  res.status(405).end();
}

// Initialize WebSocket server if not already done
if (!global.wss) {
  const { WebSocketServer } = require('ws');
  global.wss = new WebSocketServer({ noServer: true });

  global.wss.on('connection', (ws, req, code) => {
    if (!clientsByParty[code]) {
      clientsByParty[code] = new Set();
    }
    clientsByParty[code].add(ws);

    // Send initial party state
    if (parties[code]) {
      ws.send(JSON.stringify({
        type: 'update',
        host: parties[code].host,
        players: parties[code].players,
        countdown: parties[code].selfDestructTimeout 
          ? Math.ceil((parties[partyCode].selfDestructTimeout._idleStart + 
                      parties[partyCode].selfDestructTimeout._idleTimeout - 
                      Date.now()) / 1000)
          : null
      }));
    }

    ws.on('close', () => {
      if (clientsByParty[code]) {
        clientsByParty[code].delete(ws);
        if (clientsByParty[code].size === 0) {
          delete clientsByParty[code];
        }
      }
    });
  });
}