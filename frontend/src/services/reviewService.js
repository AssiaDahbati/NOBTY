import axios from "../api/axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createReview = async (payload) => {
  const res = await axios.post("/reviews", payload, getAuthConfig());
  return res.data;
};

export const getBusinessReviews = async (businessId) => {
  const res = await axios.get(`/reviews/business/${businessId}`);
  return res.data;
};

export const replyToReview = async (reviewId, payload) => {
  const res = await axios.post(
    `/reviews/${reviewId}/reply`,
    payload,
    getAuthConfig()
  );
  return res.data;
};