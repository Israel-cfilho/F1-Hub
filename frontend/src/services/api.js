import axios from 'axios'

const api = axios.create({
    baseURL: 'https://f1hub-backend.onrender.com/api',
})

export default api;