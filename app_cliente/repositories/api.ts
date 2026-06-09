import axios from "axios";

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;