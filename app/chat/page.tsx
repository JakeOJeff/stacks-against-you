"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socketClient";
import { getUserSession } from "@/lib/userSession";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";

export default function Chat() {
  const { room, userName: user } = getUserSession();
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    } else {
      socket.on("connect", handleConnect);
    }

    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user-joined", (message: string) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("message");
      socket.off("user-joined");
    };
  }, [room, user]);

  // Handle no session case
  if (!room || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-center text-lg">
          ❌ No session found. Please join from the home page.
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
    <div className="p-4">
      {!joined ? (
        <div className="flex flex-col items-center justify-center">
          <p>
            🔄 Connecting to room <strong>{room}</strong>...
          </p>
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
            <div ref={bottomRef} /> {/* 👈 Scroll anchor */}
          </div>
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
