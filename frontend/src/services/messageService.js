import axios from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllMessages = async () => {
  const res = await axios.get("/contact", getAuthConfig());
  return res.data;
};

export const markMessageAsRead = async (id) => {
  const res = await axios.patch(`/contact/${id}/read`, {}, getAuthConfig());
  return res.data;
};

export const replyToMessage = async (id, adminReply) => {
  const res = await axios.patch(
    `/contact/${id}/reply`,
    { adminReply },
    getAuthConfig()
  );
  return res.data;
};