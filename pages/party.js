import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import WebSocketClient from '../components/WebSocketClient';

export default function PartyRoom() {
  const router = useRouter();
  const { code, name } = router.query;
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!code || !name) {
      router.push('/');
      return;
    }

    // Verify party exists and check if user is host
    fetch(`/api/party?code=${code}`)
      .then(res => {
        if (!res.ok) throw new Error('Party not found');
        return res.json();
      })
      .then(data => {
        setIsHost(data.host === name);
        setIsLoading(false);
      })
      .catch(() => router.push('/'));
  }, [code, name, router]);

  if (isLoading) {
    return <div className="p-8">Loading party data...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Party: {code}</h1>
      <h2 className="text-xl mb-6">Welcome, {name} {isHost && '(Host)'}</h2>
      
      <WebSocketClient 
        partyCode={code} 
        playerName={name} 
        isHost={isHost} 
      />
    </div>
  );
}