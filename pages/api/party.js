let parties = {}; // Store in memory

export default function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { type, code, name } = req.body;

    if (type === 'host') {
      const newCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      parties[newCode] = { host: name, players: [name] };
      return res.status(200).json({ code: newCode });
    }

    if (type === 'join') {
      if (!parties[code]) return res.status(404).json({ error: 'Party not found' });
      parties[code].players.push(name);
      return res.status(200).json({ code });
    }

    return res.status(400).json({ error: 'Invalid request' });
  }

  if (method === 'GET') {
    const { code } = req.query;
    if (!parties[code]) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(parties[code]);
  }

  res.status(405).end();
}
