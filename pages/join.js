import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Join() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleJoin = async () => {
    const res = await fetch('/api/party', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'join', code: code.toUpperCase(), name }),
    });

    if (res.ok) {
      router.push(`/party?code=${code.toUpperCase()}&name=${name}`);
    } else {
      alert('Invalid code');
    }
  };

  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Join a Party</h2>
      <input
        placeholder="Party Code"
        className="border p-3 rounded-b-3xl rounded-t-2xl "
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <input
        placeholder="Nickname"
        className="border p-3 rounded-b-3xl rounded-t-2xl "
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleJoin} className="bg-green-500 text-white px-4 py-2 rounded">
        Join
      </button>
    </div>
  );
}
