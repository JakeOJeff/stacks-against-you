import { useState } from 'react';
import { useRouter } from 'next/router';

const btnStyle = {
    container: "relative w-40 sm:w-48 h-12 overflow-hidden rounded-3xl group",
    background: "absolute inset-0 bg-gray-700 transition-all duration-500 rounded-3xl",
    image: "absolute inset-0 bg-[url('/diamonds-design.png')] bg-contain translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out rounded-3xl",
    link: "relative z-10 w-full h-full flex items-center justify-center font-bold text-white px-4 py-2 group-hover:bg-gray-500/25 transition-colors duration-500 rounded-3xl",
};
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
        <main className="flex flex-col items-center justify-center h-screen bg-gray-950 bg-radial-[at_0%_0%] from-gray-900 via-gray-500 to-gray-950">
            <div><div className="flex flex-col p-8 sm:p-12 md:container  bg-gray-900/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">Stacks Against You</h1>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-300 mt-2">Host a Party</h2>
                <h3 className="text-gray-400 mt-1 ">Enter your name to create a Party and a Code will be generated.</h3>

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
            </div>
        </main>
    );
}
