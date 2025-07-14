"use client";

import { setUserSession } from "@/lib/userSession";
import { generateRoomId } from "@/lib/generateRoomId";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { socket } from "@/lib/socketClient";

const btnStyle = {
    container: "relative w-40 sm:w-48 h-12 overflow-hidden rounded-3xl group",
    background: "absolute inset-0 transition-all duration-500 rounded-3xl",
    image: "absolute inset-0 bg-[url('/diamonds-design.png')] bg-contain translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out rounded-3xl",
    link: "cursor-pointer relative z-10 w-full h-full flex items-center justify-center font-bold text-white px-4 py-2  transition-colors duration-500 rounded-3xl",
};

export default function Host() {
    const [room] = useState(generateRoomId());
    const [userName, setUserName] = useState("");
    const router = useRouter();

    const handleHostRoom = () => {
        if (!userName) return;
        setUserSession(room, userName);
        router.push("/chat");
    };

    useEffect(() => {
        socket.on("connect", () => {
            console.log("✅ Connected to socket:", socket.id);
        });

        return () => {
            socket.off("connect");
        };
    }, []);

    return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-950 bg-radial-[at_0%_0%] from-gray-900 via-gray-800 to-gray-950">
            <div className="flex flex-col p-8 sm:p-12 items-center bg-gray-900/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 text-center">
                <p className="text-white mb-4">Room ID: <strong>{room}</strong></p>
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="rounded-3xl text-white border-white w-64 px-4 py-2 mb-4 border-2"
                />
                <div className={btnStyle.container}>
                    <div className={btnStyle.background} />
                    <div className={btnStyle.image} />
                    <button onClick={handleHostRoom} className={btnStyle.link}>
                        Host Room
                    </button>
                </div>
            </div>
        </main>
    );
}
