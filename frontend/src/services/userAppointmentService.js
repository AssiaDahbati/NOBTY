import axios from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getMyAppointments = async () => {
  const userId = localStorage.getItem("userId");
  const res = await axios.get(`/appointments/user/${userId}`, getAuthConfig());
  return res.data;
};

export const cancelMyAppointment = async (id) => {
  const res = await axios.patch(
    `/appointments/${id}/status`,
    { status: "cancelled" },
    getAuthConfig()
  );
  return res.data;
};