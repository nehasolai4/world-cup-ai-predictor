import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

export const getTeams = () => api.get("/teams");

export const predictMatch = (data) => api.post("/predict", data);

export default api;