import { BASE_URL, HEADERS_WITHOUT_AUTH } from '@/config/config';
import axios  from 'axios';



let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onTokenRefreshed(newToken : string) {
  refreshSubscribers.map(callback => callback(newToken));
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(resolve => {
          addRefreshSubscriber(token => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = localStorage.getItem('refresh');

        const res = await axios.post(`${BASE_URL}/api/token/refresh/`, { refresh }, {headers : HEADERS_WITHOUT_AUTH});
        const newAccess = res.data.access;

        localStorage.setItem('access', newAccess);

        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        onTokenRefreshed(newAccess);
        refreshSubscribers = [];
        return axios(originalRequest);
      } catch (e) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login'; // redirect to login
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
