import axios from "axios";

const api = axios.create({
  baseURL: "https://nexospay-backend.vercel.app/api", // backend URL
  headers: { "Content-Type": "application/json" },
});

// Users
export const registerUser = (userData) => api.post("/users/register", userData);
export const getUserStats = (telegramId) => api.post("/users/stats", { telegramId });
export const claimReferral = (referrerId) => api.post("/users/referral", { referrerId });

// Tasks
export const updateUserProgress = (telegramId) => api.post("/tasks/complete-task", { telegramId });

// Withdraw
export const withdrawRequest = (telegramId, amount, binanceUID) =>
  api.post("/withdraw/request", { telegramId, amount, binanceUID });

export default api;

