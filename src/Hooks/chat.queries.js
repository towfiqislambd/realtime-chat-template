import { useQuery } from "@tanstack/react-query";
import { GetAllConversations, GetSingleConversation } from "./chat.api";

// Get All Conversations
export const useGetAllConversations = () => {
  return useQuery({
    queryKey: ["get-all-conversations"],
    queryFn: GetAllConversations,
    retry: false,
  });
};

// Get Single Conversations
export const useGetSingleConversation = receiver_id => {
  return useQuery({
    queryKey: ["get-single-conversation", receiver_id],
    queryFn: () => GetSingleConversation(receiver_id),
    enabled: !!receiver_id,
    retry: false,
  });
};