import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api/v1' // Ensure this matches your Backend port
});

// This sends your token automatically once you log in
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;