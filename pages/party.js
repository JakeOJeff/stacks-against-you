import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

export default function PartyRoom() {
  const router = useRouter();
  const { code, name } = router.query;

  const [players, setPlayers] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const intervalRef = useRef(null);
  const wsRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!code || !name) return;

    // Connect to WebSocket for real-time updates
    wsRef.current = new WebSocket(`wss://${window.location.host}/api/ws?code=${code}`);
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update') {
        setPlayers(data.players);
        setCountdown(data.countdown);
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [code, name]);

  // Check if user is host and set up leave detection
  useEffect(() => {
    if (!code || !name) return;

    const cookies = document.cookie.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.split('=').map(c => c.trim());
      cookies[name] = value;
      return cookies;
    }, {});

    const sessionToken = cookies['session_token'];
    if (!sessionToken) return;

    // In a real app, you'd verify this with the server
    setIsHost(!!cookies['host_token']);

    // Handle page visibility changes (tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // If host leaves, notify server
        if (isHost) {
          fetch('/api/party', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'host-left', code }),
            credentials: 'include'
          });
        }
      }
    };

    // Handle page unload (closing tab)
    const handleBeforeUnload = () => {
      fetch('/api/party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'leave', code }),
        credentials: 'include',
        keepalive: true // Ensures request completes even if page unloads
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Clean up WebSocket
      if (wsRef.current) wsRef.current.close();
    };
  }, [code, name, isHost]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [countdown]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">🎉 Party Code: {code}</h2>
      <h3 className="text-lg mt-2">Welcome, {name}! {isHost && '(Host)'}</h3>

      {countdown !== null && (
        <div className="text-red-600 mt-4 text-lg font-bold">
          ⚠️ Party will self-destruct in: {countdown}s
        </div>
      )}

      <div className="mt-6">
        <h4 className="font-semibold">Players ({players.length}):</h4>
        <ul className="list-disc list-inside">
          {players.map((player, i) => (
            <li key={i}>
              {player} {player === parties[code]?.host && '👑'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}