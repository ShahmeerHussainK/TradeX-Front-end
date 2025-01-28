import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://144.126.216.43:8000',
  headers: {
    'Accept-Language': 'en',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
