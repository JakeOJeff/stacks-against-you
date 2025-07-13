import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

export default function PartyRoom() {
  const router = useRouter();
  const { code, name } = router.query;

  const [players, setPlayers] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hostName, setHostName] = useState('');
  const intervalRef = useRef(null);
  const wsRef = useRef(null);

  // Fetch initial party data
  useEffect(() => {
    if (!code) return;

    const fetchPartyData = async () => {
      try {
        const res = await fetch(`/api/party?code=${code}`);
        if (res.ok) {
          const data = await res.json();
          setPlayers(data.players || []);
          setHostName(data.host || '');
          setCountdown(data.countdown || null);
          setIsHost(data.host === name);
        }
      } catch (error) {
        console.error('Failed to fetch party data:', error);
      }
    };

    fetchPartyData();
  }, [code, name]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!code || !name || isConnected) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws?code=${code}`;
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update') {
        setPlayers(data.players || []);
        setHostName(data.host || '');
        setCountdown(data.countdown || null);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [code, name, isConnected]);

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
          router.push('/'); // Redirect when party ends
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [countdown, router]);

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
              {player} {player === hostName && '👑'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}