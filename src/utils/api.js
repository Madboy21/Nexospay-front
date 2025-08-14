import axios from "axios";

const api = axios.create({
  baseURL: "https://nexospay-backend.vercel.app/", // backend URL
  headers: { "Content-Type": "application/json" },
});

// Users
export const registerUser = (userData) => api.post("/api/users/register", userData);
export const getUserStats = (telegramId) => api.post("/api/users/stats", { telegramId });
export const claimReferral = (referrerId) => api.post("/api/users/referral", { referrerId });

// Tasks
export const updateUserProgress = (telegramId) => api.post("/api/tasks/complete-task", { telegramId });

// Withdraw
export const withdrawRequest = (telegramId, amount, binanceUID) =>
  api.post("/api/withdraw/request", { telegramId, amount, binanceUID });

export default api;
