
"use client";

import ChatForm from "@/components/ChatForm";


export default function Chat() {
    const handlleSendMessage = (message: string) => {
        console.log(message);
    }
    return (
        <div><ChatForm onSendMessage={(message) => console.log(message)} /></div>
        
    );
}