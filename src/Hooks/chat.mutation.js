import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SendMessage } from "./chat.api";
import toast from "react-hot-toast";

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payload => SendMessage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["get-all-conversations"]);
      queryClient.invalidateQueries(["get-single-conversation"]);
    },
    onError: error => {
      toast.error(error?.response?.data?.message || "Message sending failed");
    },
  });
};
