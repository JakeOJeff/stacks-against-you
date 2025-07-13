import { useRouter } from 'next/router';
import WebSocketClient from '../components/WebSocketClient';

export default function PartyRoom() {
  const router = useRouter();
  const { code, name } = router.query;

  if (!code || !name) {
    return <div>Missing party code or player name</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Party: {code}</h1>
      <h2 className="text-xl mb-6">Welcome, {name}!</h2>
      
      <WebSocketClient partyCode={code} playerName={name} />
    </div>
  );
}