import axios from "axios";

const BASE_URL = 'http://67.205.172.167';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;