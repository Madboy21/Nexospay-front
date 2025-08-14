import axios from "axios";
const api = axios.create({ baseURL:"https://nexospay-backend.vercel.app/", headers:{"Content-Type":"application/json"} });
export const getUserStats = (telegramId) => api.post("/api/users/stats",{telegramId});
export default api;
