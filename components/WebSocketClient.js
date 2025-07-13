import { useState, useEffect, useRef } from 'react';

export default function WebSocketClient({ partyCode, playerName, isHost }) {
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const wsRef = useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws?code=${partyCode}&name=${encodeURIComponent(playerName)}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received:', data);
      
      if (data.type === 'player_list') {
        setPlayers(data.players);
      } 
      else if (data.type === 'chat_message') {
        setMessages(prev => [...prev, data]);
      }
      else if (data.type === 'party_ended') {
        alert('The host has ended the party');
        window.location.href = '/';
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [partyCode, playerName]);

  const sendMessage = () => {
    if (inputMessage.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        content: inputMessage.trim()
      }));
      setInputMessage('');
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
        <ul className="flex flex-wrap gap-2 mt-2">
          {players.map((player, i) => (
            <li key={i} className="bg-gray-700 px-2 py-1 rounded">
              {player} {player === players[0] && '👑'}
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-gray-700 rounded-lg p-4 h-64 overflow-y-auto bg-gray-900">
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <span className="font-bold text-blue-300">{msg.player}:</span>
              <span className="ml-2 text-gray-200">{msg.content}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages yet</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message"
          className="flex-1 border border-gray-700 p-2 rounded-lg bg-gray-800 text-white"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Send
        </button>
        {isHost && (
          <button
            onClick={endParty}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
          >
            End Party
          </button>
        )}
      </div>
    </div>
  );
}