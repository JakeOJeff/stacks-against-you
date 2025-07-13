import React from 'react'

interface ChatMessageProps {
  sender: string;
  message: string;
  isOwnMessage: boolean;
}

const ChatMessage = ({ sender, message, isOwnMessage }: ChatMessageProps) => {
  const isSystemMessage = sender === "system";
  return (
    <div className={`flex ${isSystemMessage ? "justify-center" : isOwnMessage ? "justify-end" : "justify-start"

      } mb-3`}>
      <div className={`max-w-xs px-4 py-2 rounded-lg
        ${isSystemMessage
          ? "bg-gray-100" : isOwnMessage
            ? "bg-blue-200 text-white" : "bg-gray-100 text-black"
        }`}>

        <div className={`max-w-xs px-4 py-2 rounded-lg ...`}>
          {!isSystemMessage && <p className="text-sm font-bold">{sender}</p>}
          <p>{message}</p>
        </div>

      </div>
    </div>
  )
}

export default ChatMessage
