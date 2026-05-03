import axios from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getMyBusiness = async () => {
  const businessId = localStorage.getItem("businessId");
  const res = await axios.get(`/businesses/${businessId}`, getAuthConfig());
  return res.data;
};

export const updateMyBusiness = async (formData) => {
  const businessId = localStorage.getItem("businessId");

  const authConfig = getAuthConfig();

  const res = await axios.put(`/businesses/${businessId}`, formData, {
    ...authConfig,
    headers: {
      ...authConfig.headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};