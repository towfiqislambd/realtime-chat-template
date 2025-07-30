import { axiosSecure } from "./useAxiosSecure";

// Get All Conversations
export const GetAllConversations = async () => {
  const { data } = await axiosSecure.get("/api/v1/conversations");
  return data?.data;
};

// Get Single Conversations
export const GetSingleConversation = async receiver_id => {
  const { data } = await axiosSecure.get(
    `/api/v1/chat/messages?receiver_id=${receiver_id}`
  );
  return data?.data;
};

// Send Message
export const SendMessage = async payload => {
  const data = await axiosSecure.post("/api/v1/message/send", payload);
  return data.data;
};
