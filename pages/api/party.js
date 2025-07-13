// In-memory storage
const parties = {}; // { code: { host: name, players: [names], hostToken: string } }
const playerSessions = {}; // { sessionId: { code, name, isHost } }

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { type, code, name } = req.body;
    const cookies = req.headers.cookie || '';
    const sessionToken = cookies.split('session_token=')[1]?.split(';')[0];

    // Host creates a new party
    if (type === 'host') {
      const newCode = generateCode();
      const hostToken = generateToken();
      const sessionId = generateToken();

      parties[newCode] = {
        host: name,
        players: [name],
        hostToken,
        selfDestructTimeout: null
      };

      playerSessions[sessionId] = { code: newCode, name, isHost: true };

      res.setHeader('Set-Cookie', [
        `session_token=${sessionId}; Path=/; HttpOnly; SameSite=Strict`,
        `host_token=${hostToken}; Path=/; HttpOnly; SameSite=Strict`
      ]);
      return res.status(200).json({ code: newCode });
    }

    // Player joins existing party
    if (type === 'join') {
      if (!parties[code]) return res.status(404).json({ error: 'Party not found' });
      
      const sessionId = generateToken();
      parties[code].players.push(name);
      playerSessions[sessionId] = { code, name, isHost: false };

      res.setHeader('Set-Cookie', `session_token=${sessionId}; Path=/; HttpOnly; SameSite=Strict`);
      return res.status(200).json({ code });
    }

    // Host leaves (starts self-destruct)
    if (type === 'host-left') {
      if (!parties[code] || !sessionToken || !playerSessions[sessionToken] || 
          !playerSessions[sessionToken].isHost) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      if (!parties[code].selfDestructTimeout) {
        parties[code].selfDestructTimeout = setTimeout(() => {
          delete parties[code];
        }, 60 * 1000);
      }
      return res.status(200).json({ message: 'Destruct timer started' });
    }

    // Player leaves
    if (type === 'leave') {
      if (!sessionToken || !playerSessions[sessionToken]) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const session = playerSessions[sessionToken];
      if (parties[session.code]) {
        parties[session.code].players = parties[session.code].players.filter(p => p !== session.name);
        
        // If host leaves, start self-destruct if not already started
        if (session.isHost && !parties[session.code].selfDestructTimeout) {
          parties[session.code].selfDestructTimeout = setTimeout(() => {
            delete parties[session.code];
          }, 60 * 1000);
        }
      }

      delete playerSessions[sessionToken];
      return res.status(200).json({ message: 'Left party' });
    }

    return res.status(400).json({ error: 'Invalid request' });
  }

  if (method === 'GET') {
    const { code } = req.query;
    if (!parties[code]) return res.status(404).json({ error: 'Party not found' });
    
    // Return party info but without sensitive data
    return res.status(200).json({
      host: parties[code].host,
      players: parties[code].players,
      countdown: parties[code].selfDestructTimeout ? 60 : null
    });
  }

  res.status(405).end();
}

// Helper functions
function generateCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

function generateToken() {
  return Math.random().toString(36).substring(2);
}