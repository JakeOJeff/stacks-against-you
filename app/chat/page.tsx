
"use client";

import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { useState } from "react"


export default function Chat() {
    const [room, setRoom] = useState("");
    const [joined, setJoined] = useState(false);
    const [messages, setMessages] = useState<
        { sender: string; message: string }[]
    >([]);
    const [userName, setUserName] = useState("");
    const handleSendMessage = (message: string) => {
        console.log(message);
    }
    return (
        <div>
            {(!joined) ? (
                <div className="flex flex-col items-center justify-center">No Room Loaded?</div>
            ) : (
                <div>
                    <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg" >{messages.map((msg, index) => (
                        <ChatMessage
                            key={index}
                            sender={msg.sender}
                            message={msg.message}
                            isOwnMessage={msg.sender === userName} />
                    ))};
                    </div>
                    <div><ChatForm onSendMessage={(message) => console.log(message)} /></div>
                </div>
            )}

        </div>


    );
}