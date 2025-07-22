import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMessage } from "./chat.api";
import toast from "react-hot-toast";

const usePostMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => postMessage(id, payload),
    onSuccess: data => {
      if (data) {
        queryClient.invalidateQueries(["single-chat"]);
      }
    },
    onError: error => {
      toast.error(error?.response?.data?.message || "Message sending failed");
    },
  });
};

export default usePostMessage;
