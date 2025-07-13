// join/pages.tsx
"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socketClient";
import { useRouter } from "next/navigation";

export default function Join() {
    const [room, setRoom] = useState("");
    const [userName, setUserName] = useState("");
    const router = useRouter();

    const handleJoinRoom = () => {
        if (!room || !userName) return;

        socket.emit("join-room", { room, userName });

        // Pass room and username via URL query parameters
        router.push(`/chat?room=${encodeURIComponent(room)}&user=${encodeURIComponent(userName)}`);
    };

    useEffect(() => {
        socket.on("user-joined", (message) => {
            console.log("user-joined:", message);
        });

        return () => {
            socket.off("user-joined");
        };
    }, []);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-2">
            <input
                type="text"
                placeholder="Enter Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-64 px-4 py-2 mb-2 border-2 rounded-lg"
            />
            <input
                type="text"
                placeholder="Enter Room ID"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
            />
            <button
                onClick={handleJoinRoom}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg"
            >
                Join Room
            </button>
        </main>
    );
}
