import axios from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminStats = async () => {
  const res = await axios.get("/admin/stats", getAuthConfig());
  return res.data;
};

export const getBusinessRequests = async () => {
  const res = await axios.get("/businesses/pending", getAuthConfig());
  return res.data;
};

export const approveBusiness = async (id) => {
  const res = await axios.patch(
    `/businesses/${id}/approve`,
    {},
    getAuthConfig()
  );
  return res.data;
};

export const rejectBusiness = async (id) => {
  const res = await axios.delete(`/businesses/${id}`, getAuthConfig());
  return res.data;
};

export const getAllBusinessesForAdmin = async () => {
  const res = await axios.get("/businesses/admin/all", getAuthConfig());
  return res.data;
};

export const updateBusinessByAdmin = async (id, payload) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(`/businesses/admin/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteBusinessByAdmin = async (id) => {
  const res = await axios.delete(`/businesses/${id}`, getAuthConfig());
  return res.data;
};

export const getClients = async () => {
  const res = await axios.get("/admin/clients", getAuthConfig());
  return res.data;
};

export const getProviders = async () => {
  const res = await axios.get("/admin/providers", getAuthConfig());
  return res.data;
};

export const getMessages = async () => {
  const res = await axios.get("/contact", getAuthConfig());
  return res.data;
};

export const markMessageAsRead = async (id) => {
  const res = await axios.patch(`/contact/${id}/read`, {}, getAuthConfig());
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`/admin/users/${id}`, getAuthConfig());
  return res.data;
};