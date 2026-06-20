import axios from "axios";

// Base URL for the Express API gateway. Override via VITE_API_URL in .env.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL });

export default api;
