import axios from '../api/axios';
import { useEffect } from 'react';
import useSessionStorage from './useSessionStorage';
import useRefreshToken from './useRefreshToken';

const useAxios = () => {
  const refreshToken = useRefreshToken();
  const [user, setUser] = useSessionStorage('auth');

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization'] && user?.token) {
          config.headers['Authorization'] = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log('====================================');
        console.log('ERROR -> ', error);
        console.log('====================================');
        const originalRequest = error?.config;
        if (error.response.status === 401 && !originalRequest?._retry) {
            console.log('====================================');
            console.log('REQUEST -> ', originalRequest);
            console.log('====================================');
          originalRequest.sent = true;
          console.log('Unauthorized, refreshing token...');
          const newToken = refreshToken(user.email, user.token);
          if (newToken) {
            setUser({
              ...user,
              token: newToken,
            });
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } else {
            console.log('Refresh token failed, logging out...');
            setUser(null);
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [user, refreshToken]);

  return axios;
};

export default useAxios;
