"use client";

import React, { useState } from 'react'
import dynamic from 'next/dynamic';
import data from '@emoji-mart/data';
import { Emoji } from 'emoji-mart';

const Picker = dynamic(() => import('@emoji-mart/react'), { ssr: false });




const ChatForm = ({
    onSendMessage
}: {
    onSendMessage: (message: string) => void;
}) => {
    const [message, setMessage] = useState("");
      const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() != "") {
            onSendMessage(message);
            setMessage("");
        }
    }
    const addEmoji = (emoji: any) => {
        setMessage((prev) => prev + emoji.native);
    };
  return (
    <form onSubmit={handleSubmit} className='flex gap-2'>
        <input      value={message}  // ← add this line

        onChange={(e) => setMessage(e.target.value)}
        type="text" className="flex-1 px-4 border-1 py-2 rounded-lg focus:outline-none text-white font-bold"
         placeholder="Type your message" />
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-xl bg-gray-800 rounded-lg px-3 py-2 text-white hover:bg-gray-700"
        >
          😊
        </button>
         <button type="submit" className="px-4 py-2 cursor-pointer text-white rounded-lg duration-500 bg-gray-900 hover:bg-gray-700">Send</button>
    
    {showEmojiPicker && (
        <div className="absolute bottom-14 left-0 z-10">
          <Picker onSelect={addEmoji} />
        </div>
      )}
    </form>

  );
}

export default ChatForm