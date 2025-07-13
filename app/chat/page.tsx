// chat/pages.tsx

"use client";

import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { socket } from "@/lib/socketClient";

export default function Chat() {
    const searchParams = useSearchParams();
    const room = searchParams.get("room") || "";
    const user = searchParams.get("user") || "";

    const [joined, setJoined] = useState(false);
    const [messages, setMessages] = useState<
        { sender: string; message: string }[]
    >([]);

    useEffect(() => {
        if (room && user && !joined) {
            socket.emit("join-room", { room, userName: user });
            setJoined(true);
        }

        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("user-joined", (message: string) => {
            setMessages((prev) => [...prev, { sender: "system", message }]);
        });

        return () => {
            socket.off("message");
            socket.off("user-joined");
        };
    }, [room, user, joined]);

    const handleSendMessage = (message: string) => {
        if (!room || !user) return;
        socket.emit("send-message", { room, sender: user, message });
        setMessages((prev) => [...prev, { sender: user, message }]);
    };

    return (
        <div className="p-4">
            {!joined ? (
                <div className="flex flex-col items-center justify-center">
                    <p>No Room Loaded?</p>
                </div>
            ) : (
                <div>
                    <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg">
                        {messages.map((msg, index) => (
                            <ChatMessage
                                key={index}
                                sender={msg.sender}
                                message={msg.message}
                                isOwnMessage={msg.sender === user}
                            />
                        ))}
                    </div>
                    <ChatForm onSendMessage={handleSendMessage} />
                </div>
            )}
        </div>
    );
}
