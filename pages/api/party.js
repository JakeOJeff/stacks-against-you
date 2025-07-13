const parties = {};

const generateCode = () => Math.random().toString(36).substring(2, 7).toUpperCase();

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { type, code, name } = req.body;

    try {
      if (type === 'host') {
        const newCode = generateCode();
        parties[newCode] = {
          host: name,
          players: [name],
          createdAt: Date.now(),
          connections: new Set()
        };
        return res.status(200).json({ code: newCode });
      }

      if (type === 'join') {
        const partyCode = code.toUpperCase();
        if (!parties[partyCode]) {
          return res.status(404).json({ error: 'Party not found' });
        }
        if (!parties[partyCode].players.includes(name)) {
          parties[partyCode].players.push(name);
        }
        return res.status(200).json({ code: partyCode });
      }

      if (type === 'end') {
        const partyCode = code.toUpperCase();
        if (parties[partyCode]) {
          // Notify all connected clients
          parties[partyCode].connections.forEach(ws => {
            if (ws.readyState === ws.OPEN) {
              ws.send(JSON.stringify({ type: 'party_ended' }));
            }
          });
          delete parties[partyCode];
        }
        return res.status(200).json({ message: 'Party ended' });
      }

      return res.status(400).json({ error: 'Invalid request type' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (method === 'GET') {
    const { code } = req.query;
    if (!code || !parties[code]) {
      return res.status(404).json({ error: 'Party not found' });
    }
    return res.status(200).json({
      host: parties[code].host,
      players: parties[code].players
    });
  }

  res.status(405).end();
}