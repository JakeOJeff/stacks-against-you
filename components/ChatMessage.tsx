import React from 'react'

interface ChatMessageProps {
    sender: string;
    message: string;
    isOwnMessage: boolean;
}

const ChatMessage = ( {sender, message, isOwnMessage }: ChatMessageProps) => {
  const isSystemMessage = sender === "system";
    return (
      
    <div className={`flex ${isSystemMessage ? "justify-center" : isOwnMessage ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-xs px-4 py-2 rounded-lg ${
        isSystemMessage
          ? "bg-gray-900/25 text-white font-semibold "
          : isOwnMessage
          ? "bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl min-w-32  text-right  text-white duration-300 border border-gray-900 hover:bg-gray-900 hover:animate-pulse"
          : "bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl min-w-32 text-left text-white/70 duration-300 border border-gray-800 hover:bg-gray-700/60 hover:animate-pulse"
      }`}>
        {!isSystemMessage && <p className="text-lg font-bold ">{sender}</p>}
        <p>{message}</p>
      </div>
    </div>
  )
}

export default ChatMessage