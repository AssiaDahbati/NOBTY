import axios from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const updateWorkingHours = async (schedule) => {
  const businessId = localStorage.getItem("businessId");

  const res = await axios.patch(
    `/businesses/${businessId}/hours`,
    { schedule },
    getAuthConfig()
  );

  return res.data;
};