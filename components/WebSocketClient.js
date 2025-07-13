import { useState, useEffect, useRef } from 'react';

export default function WebSocketClient({ partyCode, playerName }) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    wsRef.current = new WebSocket(`${protocol}//${window.location.host}/api/ws?code=${partyCode}`);

    wsRef.current.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      // Send join message
      wsRef.current.send(JSON.stringify({
        type: 'join',
        player: playerName
      }));
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    wsRef.current.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [partyCode, playerName]);

  const sendMessage = (content) => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        player: playerName,
        content,
        timestamp: new Date().toISOString()
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 rounded">
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      
      <div className="border rounded p-4 h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <strong>{msg.player}:</strong> {msg.content}
          </div>
        ))}
      </div>
      
      <input
        type="text"
        placeholder="Type a message"
        className="border p-2 w-full"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && e.target.value) {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}