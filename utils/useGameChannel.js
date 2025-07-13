import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useGameChannel(gameId, myUserId, onReceive) {
  useEffect(() => {
    const channel = supabase.channel(gameId, { config: { ack: true } })
      .on('broadcast', { event: 'game_state' }, ({ payload }) => {
        onReceive(payload);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [gameId]);
}

export async function sendGameState(channel, myUserId, state) {
  await channel.send({
    type: 'broadcast',
    event: 'game_state',
    payload: { userId: myUserId, ...state },
  });
}
