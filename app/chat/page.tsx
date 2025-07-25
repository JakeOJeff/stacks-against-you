"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socketClient";
import { getUserSession } from "@/lib/userSession";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import Link from 'next/link'
import PageWrapper from "@/components/PageWrapper";

export default function Chat() {
    const { room, userName: user } = getUserSession();
    const [joined, setJoined] = useState(false);
    const [messages, setMessages] = useState<
        { sender: string; message: string }[]
    >([]);

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        navigator.clipboard.writeText(room).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
        });

    };
    // Scroll to bottom whenever messages update
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Setup socket listeners on mount
    useEffect(() => {
        if (!room || !user) return;

        const handleConnect = () => {
            console.log("✅ Socket connected, joining room:", room);
            socket.emit("join-room", { room, userName: user });
            setJoined(true);
        };

        if (socket.connected) {
            handleConnect();
        }

        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("user-joined", (message: string) => {
            setMessages((prev) => [...prev, { sender: "system", message }]);
        });

        return () => {
            socket.off("connect");
            socket.off("message");
            socket.off("user-joined");
        };
    }, [room, user]);

    // Handle no session case
    if (!room || !user) {
        return (
            <div className="bg-gray-950 flex flex-col items-center justify-center min-h-screen">
                <p className="text-center text-lg text-white">
                    ❌<strong>No session found.</strong>  Please join from the <a href="/" className="underline font-bold hover:text-gray-500 duration-500">Home</a> page.
                </p>
            </div>
        );
    }

    // Send a message
    function handleSendMessage(message: string) {
        if (!room || !user) return;
        socket.emit("send-message", { room, sender: user, message });
        setMessages((prev) => [...prev, { sender: user, message }]);
    }

    return (
           <PageWrapper>
       
             <main className="relative flex flex-col items-center justify-center h-screen overflow-hidden">
            <div className="p-4">
                {!joined ? (
                    <div className="flex flex-col items-center justify-center text-white text-md">
                        <p className="text-2xl">
                            🔄 Connecting to room <strong>{room}</strong>...
                        </p>
                        <p>
                            An Error has occured: Vercel Websockets are WIP
                        </p>
                        <p>
                            Highly recommend to run software LOCALLY on your Desktop <strong>[npm run dev:socket]</strong>
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center min-h-screen">
                        <div className="flex w-[80vw] p-4 mb-4 bg-gray-900/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 justify-between items-center">
                            <div className="flex">
                                <div className="text-white">Party Room:</div>
                                <a
                                    onClick={handleCopy}
                                    className="text-white font-bold ml-2 cursor-pointer"
                                >
                                    {room}
                                </a>

                                {copied && (
                                    <div className="absolute left-0 -top-6 bg-gray-600 text-white text-xs font-medium px-2 py-1 rounded shadow-lg">
                                        Copied Room ID!
                                    </div>
                                )}
                            </div>
                            <Link className="cursor-pointer duration-500 text-white hover:text-red-500 transition" href="/join" >Exit</Link>
                        </div>

                        <div className="w-[80vw] h-[500px] overflow-y-auto p-4 mb-4 bg-gray-900/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar]:h-3
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-gray-950/25
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-gray-900/75
                        [&::-webkit-scrollbar-thumb:hover]:bg-gray-800/75
                        [&::-webkit-scrollbar-thumb]:transition-colors">
                            {messages.map((msg, index) => (
                                <ChatMessage
                                    key={index}
                                    sender={msg.sender}
                                    message={msg.message}
                                    isOwnMessage={msg.sender === user}
                                />
                            ))}
                            <div ref={bottomRef} /> {/* 👈 Scroll anchor */}

                        </div>
                        <div className="w-[80vw] p-4 mb-4 bg-gray-900/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700">
                            <ChatForm onSendMessage={handleSendMessage} />

                        </div>

                    </div>

                )}
            </div>
        </main>
       </PageWrapper>

    );
}
