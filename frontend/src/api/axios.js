import axios from 'axios';

const API = axios.create({
    baseURL: "https://reverse-logistics-hyperlocal-re-48cd.onrender.com"
});

API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default API;
