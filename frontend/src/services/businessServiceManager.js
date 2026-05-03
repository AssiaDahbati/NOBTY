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
  const res = await axios.get("/businesses/my-business", getAuthConfig());
  return res.data;
};

export const getBusinessServices = async () => {
  const businessId = localStorage.getItem("businessId");

  if (!businessId) {
    throw new Error("Business ID is missing");
  }

  const res = await axios.get(
    `/services/business/${businessId}`,
    getAuthConfig()
  );
  return res.data;
};

export const createBusinessService = async (payload) => {
  const businessId = localStorage.getItem("businessId");

  if (!businessId) {
    throw new Error("Business ID is missing");
  }

  const formData = new FormData();
  formData.append("businessId", businessId);
  formData.append("name", payload.name);
  formData.append("description", payload.description || "");
  formData.append("price", payload.price);
  formData.append("duration", payload.duration);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const res = await axios.post("/services", formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateBusinessService = async (id, payload) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("description", payload.description || "");
  formData.append("price", payload.price);
  formData.append("duration", payload.duration);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  const res = await axios.put(`/services/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteBusinessService = async (id) => {
  const res = await axios.delete(`/services/${id}`, getAuthConfig());
  return res.data;
};