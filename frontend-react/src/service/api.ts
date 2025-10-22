
import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8080", // Use env variable or fallback
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false, // Helps with CORS
    timeout: 10000, // 10 second timeout
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle CORS errors
        if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
            console.error('CORS or Network Error - Backend may not be running or CORS not configured');
            console.error('Make sure backend is running on port 8080 and CORS is configured for your frontend port');
        }
        
        if (error.response && error.response.status === 401) {
            // Token expired or invalid - clear localStorage and redirect to login
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
