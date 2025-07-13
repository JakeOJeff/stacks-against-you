import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default function Lobby({ onGameStart }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lobby, setLobby] = useState(null);
  const myUserId = uuidv4();

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('lobby', { config: { presence: { key: myUserId } } })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setUsers(Object.values(state).map(p => p[0].user_id));
      })
      .on('broadcast', { event: 'game_start' }, ({ payload }) => {
        if (payload.participants.includes(myUserId)) {
          onGameStart(payload.game_id);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: myUserId });
          setLobby(channel);
        }
      });

    return () => supabase.removeChannel(channel);
  }, []);

  const startGame = async () => {
    setLoading(true);
    const gameId = uuidv4();
    await lobby.send({
      type: 'broadcast',
      event: 'game_start',
      payload: { participants: users, game_id: gameId }
    });
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2>Lobby ({users.length} players)</h2>
      <ul>
        {users.map(u => (
          <li key={u}>{u === myUserId ? u + " (You)" : u}</li>
        ))}
      </ul>
      <button
        disabled={users.length < 2 || loading}
        onClick={startGame}
        className="mt-4 px-4 py-2 bg-blue-500 text-white"
      >
        {loading ? 'Starting Game...' : 'Start Game'}
      </button>
    </div>
  );
}
