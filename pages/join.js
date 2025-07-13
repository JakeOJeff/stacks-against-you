import { useState } from 'react';
import { useRouter } from 'next/router';
const btnStyle = {
    container: "relative w-40 sm:w-48 h-12 overflow-hidden rounded-3xl group",
    background: "absolute inset-0 bg-gray-700 transition-all duration-500 rounded-3xl",
    image: "absolute inset-0 bg-[url('/diamonds-design.png')] bg-contain translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out rounded-3xl",
    link: "relative z-10 w-full h-full flex items-center justify-center font-bold text-white px-4 py-2 group-hover:bg-gray-500/25 transition-colors duration-500 rounded-3xl",
};
export default function Join() {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const router = useRouter();

    const handleJoin = async () => {
        const res = await fetch('/api/party', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'join', code: code.toUpperCase(), name: name.trim() }),
        });

        if (res.ok) {
            router.push(`/party?code=${code.toUpperCase()}&name=${name}`);
        } else {
            alert('Invalid code');
        }
    };

    return (
        <main className="flex flex-col items-center justify-center h-screen bg-gray-950 bg-radial-[at_0%_0%] from-gray-900 via-gray-500 to-gray-950">
            <div><div className="gap-2 flex flex-col p-8 sm:p-12 md:container  bg-gray-900/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 text-center">
                <h2 className="text-xl sm:text-3xl font-bold text-gray-300 mt-2">Join a Party</h2>
                <h3 className="text-gray-400 mt-1 ">Enter your party code and a nickname to join the game</h3>
                <input
                    placeholder="Party Code"
                    className="border p-3 rounded-b-2xl rounded-t-3xl "
                    value={code}
                    onChange={e => setCode(e.target.value)}
                />
                <input
                    placeholder="Nickname"
                    className="border p-3 rounded-b-3xl rounded-t-2xl "
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <div className="flex gap-2 justify-center mt-6 flex-wrap">
                    <div className={btnStyle.container}>
                        <div className={btnStyle.background} />
                        <div className={btnStyle.image} />
                        <button onClick={handleJoin} className={btnStyle.link}>Join Party</button>
                    </div>
                </div>
            </div>
            </div>
        </main>
    );
}
