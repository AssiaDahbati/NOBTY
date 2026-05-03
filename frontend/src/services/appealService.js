import axios from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllAppeals = async () => {
  const res = await axios.get("/appeals", getAuthConfig());
  return res.data;
};

export const updateAppealStatus = async (id, status, adminNote = "") => {
  const res = await axios.patch(
    `/appeals/${id}/status`,
    { status, adminNote },
    getAuthConfig()
  );
  return res.data;
};