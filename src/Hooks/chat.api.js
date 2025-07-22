import { axiosSecure } from "./useAxiosSecure";

export const postMessage = async (id, payload) => {
  const response = await axiosSecure.post(`/api/send-message/${id}`, payload);
  return response.data;
};
