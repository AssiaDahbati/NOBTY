import axios from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getBusinessAppointments = async () => {
  const businessId = localStorage.getItem("businessId");
  const res = await axios.get(
    `/appointments/business/${businessId}`,
    getAuthConfig()
  );
  return res.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const res = await axios.patch(
    `/appointments/${id}/status`,
    { status },
    getAuthConfig()
  );
  return res.data;
};