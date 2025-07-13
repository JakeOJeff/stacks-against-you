const parties = {};

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { type, code, name } = req.body;

    try {
      if (type === 'host') {
        const newCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        parties[newCode] = {
          host: name,
          players: [name],
          sockets: new Set()
        };
        return res.json({ code: newCode });
      }

      if (type === 'join') {
        const partyCode = code.toUpperCase();
        if (!parties[partyCode]) return res.status(404).json({ error: 'Party not found' });
        if (!parties[partyCode].players.includes(name)) {
          parties[partyCode].players.push(name);
        }
        return res.json({ code: partyCode });
      }

      if (type === 'end') {
        const partyCode = code.toUpperCase();
        if (parties[partyCode]) {
          parties[partyCode].sockets.forEach(ws => {
            ws.send(JSON.stringify({ type: 'party_ended' }));
            ws.close();
          });
          delete parties[partyCode];
        }
        return res.json({ success: true });
      }

      return res.status(400).json({ error: 'Invalid request' });
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (method === 'GET') {
    const { code } = req.query;
    if (!code || !parties[code]) return res.status(404).json({ error: 'Party not found' });
    return res.json(parties[code]);
  }

  res.status(405).end();
}