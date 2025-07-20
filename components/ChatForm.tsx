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
  const [lastUsedEmoji, setLastUsedEmoji] = useState("😊"); // default emoji

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  const addEmoji = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setLastUsedEmoji(emoji.native); // update last used emoji
    setShowEmojiPicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 relative w-full items-center">

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        className="flex-shrink min-w-0 flex-grow border-gray-900 flex-1 px-4 border-none py-2 rounded-lg focus:outline-none text-white font-bold"
        placeholder="Type your message"
      />
      <button
        type="button"
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        className="flex-shrink-0 cursor-pointer duration-500  text-xl bg-gray-800 rounded-l-full px-3 py-2 text-white hover:bg-gray-700"
      >
        {lastUsedEmoji}
      </button>
      <button
        type="submit"
        className="flex-shrink-0  px-4 py-2 cursor-pointer text-white rounded-r-full duration-500 bg-gray-900 hover:bg-gray-700"
      >
        Send
      </button>

      {showEmojiPicker && (
        <div className="absolute bottom-14 left-0 z-10">
          <Picker data={data} onEmojiSelect={addEmoji} theme="dark" />
        </div>
      )}
    </form>
  );
};

export default ChatForm;
