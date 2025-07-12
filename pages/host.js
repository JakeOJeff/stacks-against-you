import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Host() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleHost = async () => {
    const res = await fetch('/api/party', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'host', name }),
    });
    const data = await res.json();
    router.push(`/party?code=${data.code}&name=${name}`);
  };

  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Host a Party</h2>
      <input
        placeholder="Your Name"
        className="border p-2"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleHost} className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Party
      </button>
    </div>
  );
}
