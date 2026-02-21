import axios from 'axios'
 
const BASE_URL = import.meta.env.VITE_BACKEND_DEV_URL;

const api = axios.create({
  baseURL: BASE_URL ?? "http://localhost:3000/api", 
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});


// api.interceptors.response.use((response)=>response, 
// (error)=> {
//   if (error.response?.status === 401) {
//       api.get('/api/auth/token/refresh',{
//         withCredentials : true
//       })
//     }

//     return Promise.reject(error);
// }
// )

export default api;



