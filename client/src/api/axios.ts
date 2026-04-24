import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/api'
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') // Read JWt token from browser's local storage
    if (token) { // If token exists then attach to Auth header for Express middleware
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api