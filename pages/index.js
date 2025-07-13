import { useState } from 'react';
import Lobby from '../components/Lobby'; // Move it to components

export default function Home() {
  const [gameId, setGameId] = useState(null);

  return !gameId
    ? <Lobby onGameStart={(id) => setGameId(id)} />
    : <div>Game Started! ID: {gameId}</div>;
}
