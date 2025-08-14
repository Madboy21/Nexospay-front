import axios from "axios";

const api = axios.create({
  baseURL: "https://nexospay-backend.vercel.app/", // Backend URL
  headers: { "Content-Type": "application/json" }
});

export const getUserStats = (telegramId) => api.post("/api/users/stats", { telegramId });
export const registerUser = (data) => api.post("/api/users/register", data);
export const withdrawRequest = (telegramId, amount, binanceUID) =>
  api.post("/api/withdraw/request", { telegramId, amount, binanceUID });

export default api;
