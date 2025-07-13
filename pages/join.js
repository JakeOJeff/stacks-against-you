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
        if (!code.trim() || !name.trim()) return;
        
        const res = await fetch('/api/party', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                type: 'join', 
                code: code.trim().toUpperCase(), 
                name: name.trim() 
            }),
        });

        if (res.ok) {
            router.push(`/party?code=${code.trim().toUpperCase()}&name=${name.trim()}`);
        } else {
            const error = await res.json();
            alert(error.error || 'Failed to join party');
        }
    };

    return (
        <main className="flex flex-col items-center justify-center h-screen bg-gray-950">
            <div className="gap-2 flex flex-col p-8 sm:p-12 md:container bg-gray-900/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 text-center">
                <h2 className="text-xl sm:text-3xl font-bold text-gray-300 mt-2">Join a Party</h2>
                <h3 className="text-gray-400 mt-1">Enter party code and nickname</h3>
                
                <input
                    placeholder="Party Code"
                    className="border border-gray-700 p-3 rounded-lg bg-gray-800 text-white mt-4"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    maxLength="5"
                />
                
                <input
                    placeholder="Nickname"
                    className="border border-gray-700 p-3 rounded-lg bg-gray-800 text-white"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                
                <div className="flex gap-2 justify-center mt-6 flex-wrap">
                    <div className={btnStyle.container}>
                        <div className={btnStyle.background} />
                        <div className={btnStyle.image} />
                        <button 
                            onClick={handleJoin} 
                            className={btnStyle.link}
                            disabled={!code.trim() || !name.trim()}
                        >
                            Join Party
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}