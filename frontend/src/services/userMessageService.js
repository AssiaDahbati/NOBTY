import axios from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getMyMessages = async () => {
  const res = await axios.get("/contact/my-messages", getAuthConfig());
  return res.data;
};

export const getUnreadReplyCount = async () => {
  const res = await axios.get(
    "/contact/my-messages/unread-count",
    getAuthConfig()
  );
  return res.data;
};

export const markReplyAsSeen = async (id) => {
  const res = await axios.patch(
    `/contact/my-messages/${id}/seen`,
    {},
    getAuthConfig()
  );
  return res.data;
};