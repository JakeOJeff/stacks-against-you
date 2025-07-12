import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PartyRoom() {
  const router = useRouter();
  const { code, name } = router.query;
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!code) return;
    const fetchPlayers = async () => {
      const res = await fetch(`/api/party?code=${code}`);
      const data = await res.json();
      setPlayers(data.players);
    };
    fetchPlayers();
  }, [code]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">🎉 Party Code: {code}</h2>
      <h3 className="text-lg mt-4">Welcome, {name}!</h3>
      <div className="mt-6">
        <h4 className="font-semibold">Players:</h4>
        <ul className="list-disc list-inside">
          {players.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
