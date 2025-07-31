import { useEffect, useRef, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import moment from "moment";
import { useSendMessage } from "../../Hooks/chat.mutation";

const ChatBody = ({ chatId, chatData, isLoading }) => {
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const { mutate: sendMessage, isPending } = useSendMessage();

  useEffect(() => {
    if (chatData?.messages?.data) {
      setConversations(chatData?.messages?.data);
    }
  }, [chatData?.messages?.data]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const handleSend = () => {
    if (!message.trim() || !chatId) return;
    const data = { receiver_id: chatId, message };
    sendMessage(data);
    setMessage("");
  };

  return (
    <section className="flex flex-1 flex-col">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 bg-white flex items-center gap-3 shrink-0">
        <h3 className="text-lg font-semibold text-gray-700">
          {chatId
            ? chatData?.conversation?.participants[0]?.participant?.name
            : "Anonyms User"}
        </h3>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-4 bg-gray-50">
        {/* Fallback Texts */}
        {!chatId && (
          <div className="flex justify-center items-center h-full text-gray-400">
            Select a chat to start messaging
          </div>
        )}
        {chatData?.messages?.data?.length === 0 && (
          <div className="flex justify-center items-center h-full text-gray-400">
            No messages yet. Start the conversation!
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-full text-gray-400">
            Loading messages...
          </div>
        ) : (
          // All Chats
          conversations?.map(msg => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                user?.id === msg?.sender_id ? "justify-end" : "justify-start"
              }`}
            >
              {user?.id !== msg?.sender_id && (
                <img
                  src={`${import.meta.env.VITE_SITE_URL}/${
                    msg?.sender?.avatar
                  }`}
                  alt="avatar"
                  className="size-8 rounded-full object-cover"
                />
              )}
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs overflow-hidden text-sm shadow-sm 
                ${
                  user?.id === msg?.sender_id
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                } 
                ${msg.status === "sending" && "opacity-70"} 
                ${msg.status === "failed" && "bg-red-100 text-red-800"}
              `}
              >
                <p>{msg.message}</p>
                <p
                  className={`text-[10px] mt-1 text-right ${
                    user?.id === msg?.sender_id
                      ? "text-gray-200"
                      : "text-gray-500"
                  }`}
                >
                  {moment(msg.created_at).format("LT")}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white flex gap-3 items-center shrink-0">
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          type="text"
          placeholder={
            !chatId ? "Select a chat to message" : "Write your message..."
          }
          className={`flex-1 px-4 py-2 border-gray-200 border rounded-full focus:outline-none focus:ring-2 ${
            !chatId ? "bg-gray-100 cursor-not-allowed" : "focus:ring-blue-400"
          }`}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          disabled={!chatId}
        />

        {/* Send btn */}
        <button
          onClick={handleSend}
          disabled={!chatId || !message.trim() || isPending}
          className={`px-5 py-2 rounded-full font-medium transition ${
            !chatId || !message.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isPending ? "Sending..." : "Send"}
        </button>
      </div>
    </section>
  );
};

export default ChatBody;
