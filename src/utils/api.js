import axios from "axios";

const api = axios.create({ baseURL: "https://nexospay-backend.vercel.app/", headers: { "Content-Type": "application/json" } });

export const getUserStats = (telegramId) => api.post("/api/users/stats", { telegramId });
export const updateUserProgress = (telegramId, taskName) => api.post("/api/tasks/complete-task", { telegramId, taskName });
export const claimReferral = (referrerId) => api.post("/api/users/referral", { referrerId });
export const withdrawRequest = (telegramId, amount, binanceUID) => api.post("/api/withdraw/request", { telegramId, amount, binanceUID });

export default api;
