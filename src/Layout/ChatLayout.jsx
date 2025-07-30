import React, { useState } from "react";
import ChatSidebar from "../Pages/Chat/ChatSidebar";
import { useGetSingleConversation } from "../Hooks/chat.queries";
import ChatBody from "../Pages/Chat/ChatBody";

const ChatLayout = () => {
  const [chatId, setChatId] = useState(null);
  const { data: singleConversation, isLoading } = useGetSingleConversation(chatId);

  return (
    <section className="flex h-screen bg-gray-50">
      {/* Chat Sidebar */}
      <ChatSidebar setChatId={setChatId} />

      {/* Chat Body */}
      <ChatBody
        chatData={singleConversation}
        isLoading={isLoading}
        chatId={chatId}
      />
    </section>
  );
};

export default ChatLayout;
