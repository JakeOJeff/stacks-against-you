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
          ? "bg-white/25 "
          : isOwnMessage
          ? "bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl min-w-32 border text-right border-gray-600 text-white duration-300  hover:bg-gray-900 hover:animate-pulse"
          : "bg-gray-100/50 backdrop-blur-lg rounded-2xl shadow-2xl min-w-32 border text-left border-gray-100 text-black duration-300 hover:bg-gray-100 hover:animate-pulse "
      }`}>
        {!isSystemMessage && <p className="text-lg font-bold ">{sender}</p>}
        <p>{message}</p>
      </div>
    </div>
  )
}

export default ChatMessage