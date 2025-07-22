import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useChatConversion = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: chats,
    isLoading: chatLoading,
    refetch,
  } = useQuery({
    queryKey: ["chat-lists"],
    retry: false,
    queryFn: async () => {
      const response = await axiosSecure.get(`/api/conversations`);
      return response.data;
    },
  });

  return { chats, chatLoading, refetch };
};

export const useSingleChatConversion = userId => {
  const axiosSecure = useAxiosSecure();

  const {
    data: singleConversion,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["single-chat", userId],
    queryFn: async () => {
      const response = await axiosSecure.get(`/api/chat/${userId}`);
      return response.data;
    },
    retry: false,
    enabled: !!userId,
  });

  return { singleConversion, isLoading, refetch };
};
