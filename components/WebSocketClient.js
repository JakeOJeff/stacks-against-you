import { useState, useEffect, useRef } from 'react';

export default function WebSocketClient({ partyCode, playerName, isHost }) {
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(
      `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/ws?code=${partyCode}&name=${playerName}`
    );

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'player_list') setPlayers(data.players);
      if (data.type === 'chat') setMessages(prev => [...prev, data]);
      if (data.type === 'party_ended') window.location.href = '/';
    };

    return () => ws.current?.close();
  }, [partyCode, playerName]);

  const sendMessage = () => {
    if (input.trim() && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'chat',
        message: input.trim()
      }));
      setInput('');
    }
  };

  const endParty = () => {
    if (isHost) {
      fetch('/api/party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'end', code: partyCode })
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-800 rounded-lg">
        <h4 className="font-semibold">Players ({players.length}):</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {players.map((p, i) => (
            <span key={i} className="bg-gray-700 px-2 py-1 rounded">
              {p} {i === 0 && '👑'}
            </span>
          ))}
        </div>
      </div>

      <div className="border border-gray-700 rounded-lg p-4 h-64 overflow-y-auto bg-gray-900">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <span className="font-bold text-blue-300">{msg.from}:</span>
            <span className="ml-2 text-gray-200">{msg.message}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
          placeholder="Type message"
        />
        <button 
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Send
        </button>
        {isHost && (
          <button
            onClick={endParty}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            End
          </button>
        )}
      </div>
    </div>
  );
}