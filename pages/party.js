import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import WebSocketClient from '../components/WebSocketClient';

export default function Party() {
  const router = useRouter();
  const { code, name } = router.query;
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code || !name) {
      router.push('/');
      return;
    }

    fetch(`/api/party?code=${code}`)
      .then(res => res.json())
      .then(data => {
        setIsHost(data.host === name);
        setLoading(false);
      })
      .catch(() => router.push('/'));
  }, [code, name, router]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Party: {code}</h1>
      <h2 className="text-xl mb-6">Welcome, {name} {isHost && '(Host)'}</h2>
      <WebSocketClient partyCode={code} playerName={name} isHost={isHost} />
    </div>
  );
}