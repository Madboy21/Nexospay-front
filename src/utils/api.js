// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://nexospay-backend.vercel.app/",
  headers: { "Content-Type": "application/json" },
});

// User APIs
export const getUserStats = (telegramId) => api.post("/api/users/stats", { telegramId });
export const registerUser = (userData) => api.post("/api/users/register", userData);
export const updateUserProgress = (telegramId) => api.post("/api/tasks/complete-task", { telegramId });
export const claimReferral = (referrerId) => api.post("/api/users/referral", { referrerId });
export const withdrawRequest = (telegramId, amount, binanceUID) =>
  api.post("/api/withdraw/request", { telegramId, amount, binanceUID });

export default api;
