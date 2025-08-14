import axios from "axios";

const backendUrl = "https://nexospay-backend.vercel.app/"; // change if deployed

const api = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// USER APIs
export const getUserStats = (telegramId) =>
  api.post("/api/users/stats", { telegramId });

export const updateUserProgress = (telegramId, taskName) =>
  api.post("/api/tasks/complete-task", { telegramId, taskName });

export const claimReferral = (referrerId) =>
  api.post("/api/users/referral", { referrerId });

// WITHDRAW API
export const withdrawRequest = (telegramId, amount, binanceUID) =>
  api.post("/api/withdraw/request", { telegramId, amount, binanceUID });

export default api;

