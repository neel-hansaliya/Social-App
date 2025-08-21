// import axios from "axios";

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
//     withCredentials: true, // if backend sets cookies; otherwise token header used
// });

// // attach token to requests
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });

// export default api;
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true, // send cookies if your backend uses them
});

// Attach auth token from localStorage to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
