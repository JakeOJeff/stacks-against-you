"use client";

import { useState } from "react"


export default function Join() {
    const [room, setRoom] = useState("");
    const [joined, setJoined] = useState(false);
    const [messages, setMessages] = useState<
        { sender: string; message: string }[]
    >([]);
    const [userName, setUserName] = useState("");
    const handleJoinRoom = () => {
        setJoined(true);
    }
    const handleSendMessage = (message: string) => {
        console.log(message);
    }

    return (
        <main>
            <input
                type="text"
                placeholder="Enter Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
            />
            <input
                type="text"
                placeholder="Enter Room ID"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
            />
            <button onClick={handleJoinRoom}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg">
                Join Room
            </button>
        </main>


    )
}