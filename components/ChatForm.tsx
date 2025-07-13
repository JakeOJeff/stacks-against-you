"use client";

import React, { useState } from 'react'



const ChatForm = ({
    onSendMessage
}: {
    onSendMessage: (message: string) => void;
}) => {
    const [message, setMessage] = useState("");
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() != "") {
            onSendMessage(message);
            setMessage("");
        }
    }
  return (
    <form onSubmit={handleSubmit} className='flex gap-2'>
        <input 
        onChange={(e) => setMessage(e.target.value)}
        type="text" className="flex-1 px-4 border-2 py-2 rounded-lg focus:outline-none"
         placeholder="Type your message" />

         <button type="submit" className="px-4 py-2 text-white rorunded-lg bg-green-300">Send</button>
    </form>

  );
}

export default ChatForm
