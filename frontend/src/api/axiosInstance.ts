import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

export default axiosInstance