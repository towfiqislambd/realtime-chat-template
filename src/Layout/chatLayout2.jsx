import { useEffect, useRef, useState } from "react";
import usePostMessage from "@/hooks/chat.mutation";
import {
  useChatConversion,
  useSingleChatConversion,
} from "@/hooks/chat.queries";
import useAuth from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useLocation } from "react-router-dom";
import getEchoInstance from "@/hooks/echo";

const ChatLayout = () => {
  const messagesEndRef = useRef(null);
  const { user, token } = useAuth(); // Make sure useAuth provides the token
  const [message, setMessage] = useState("");
  const { mutate: sendMessage, isPending } = usePostMessage();
  const location = useLocation();
  const [chatId, setChatId] = useState(null);
  const { singleConversion, refetch, isLoading } =
    useSingleChatConversion(chatId);
  const { chats, chatLoading } = useChatConversion();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState([]);
  const [echo, setEcho] = useState(null);

  // Initialize Echo instance when token changes
  useEffect(() => {
    if (token) {
      const echoInstance = getEchoInstance(token);
      setEcho(echoInstance);

      return () => {
        // Cleanup on unmount
        if (echoInstance) {
          echoInstance.disconnect();
        }
      };
    }
  }, [token]);

  useEffect(() => {
    if (singleConversion?.data?.messages) {
      setMessages(singleConversion.data.messages);
    }
  }, [singleConversion?.data?.messages]);

  useEffect(() => {
    if (!echo || !user?.id) return;

    const channel = echo.private(`chat-channel.${user.id}`);
    const latestChannel = echo.private(`latest-message-channel.${user.id}`);

    const messageHandler = e => {
      if (+e.data.receiver_id === +user.id && +e.data.chat_id === +chatId) {
        setMessages(prev => [...prev, e.data]);
        queryClient.invalidateQueries(["chat-lists"]);
      }
    };

    const latestMessageHandler = e => {
      if (+e.receiverId === +user.id) {
        queryClient.invalidateQueries(["chat-lists"]);
      }
    };

    channel.listen("MessageSentEvent", messageHandler);
    latestChannel.listen("LatestMassageEvent", latestMessageHandler);

    return () => {
      channel.stopListening("MessageSentEvent", messageHandler);
      latestChannel.stopListening("LatestMassageEvent", latestMessageHandler);
    };
  }, [echo, user?.id, queryClient, chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || !chatId) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      sender_id: user.id,
      sender: {
        avatar: user.avatar || null,
        first_name: user.first_name || "You",
      },
      type: "text",
      message: message.trim(),
      created_at: new Date().toISOString(),
      status: "sending",
      chat_id: chatId, // Make sure to include chat_id
    };

    setMessages(prev => [...prev, tempMessage]);
    setMessage("");

    const formData = new FormData();
    formData.append("message", tempMessage.message);
    formData.append("chat_id", chatId);

    sendMessage(
      { id: chatId, payload: formData },
      {
        onSuccess: data => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === tempId
                ? { ...msg, ...data.message, status: "sent" }
                : msg
            )
          );
          refetch(); // Refresh the chat after successful send
        },
        onError: () => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === tempId ? { ...msg, status: "failed" } : msg
            )
          );
        },
      }
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white flex flex-col">
        <h2 className="text-lg font-semibold p-5 border-b shrink-0">Chats</h2>

        {/* Chat list with independent scroll */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chatLoading
            ? [1, 2, 3, 4].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg animate-pulse bg-gray-100"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-300" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-gray-300 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            : chats?.data?.map(item => (
                <div
                  key={item?.id}
                  onClick={() => setChatId(+item?.participants[0].user_id)}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition ${
                    +item?.participants[0].user_id === chatId
                      ? "bg-blue-50"
                      : ""
                  }`}
                >
                  <img
                    src={`${import.meta.env.VITE_SITE_URL}/${
                      item?.participants[0]?.user?.avatar
                    }`}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div className="flex-1">
                    <p className="font-medium">
                      {item?.participants[0]?.user?.first_name}{" "}
                      {item?.participants[0]?.user?.last_name}
                    </p>
                    <p
                      className={`text-sm truncate ${
                        item?.last_message?.is_read
                          ? "text-gray-500"
                          : "text-blue-600 font-medium"
                      }`}
                    >
                      {item?.last_message?.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {moment(item?.last_message?.created_at).fromNow()}
                  </span>
                </div>
              ))}
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="p-4 border-b bg-white flex items-center gap-3 shrink-0">
          <h3 className="text-lg font-semibold">
            {chats?.data?.find(c => +c?.participants[0].user_id === chatId)
              ?.participants[0]?.user?.first_name || "Chat"}
          </h3>
        </div>

        {/* Messages with independent scroll */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
          {!chatId ? (
            <div className="flex justify-center items-center h-full text-gray-400">
              Select a chat to start messaging
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center h-full text-gray-400">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-400">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map(msg => (
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
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow-sm ${
                    user?.id === msg?.sender_id
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  } ${msg.status === "sending" && "opacity-70"} ${
                    msg.status === "failed" && "bg-red-100 text-red-800"
                  }`}
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

        {/* Input */}
        <div className="p-4 border-t bg-white flex gap-3 items-center shrink-0">
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            type="text"
            placeholder={
              !chatId ? "Select a chat to message" : "Write your message..."
            }
            className={`flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 ${
              !chatId ? "bg-gray-100 cursor-not-allowed" : "focus:ring-blue-400"
            }`}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            disabled={!chatId}
          />
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
      </div>
    </div>
  );
};

export default ChatLayout;
