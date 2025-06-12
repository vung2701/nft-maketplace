import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_BE_SEPOLIA_URL;
const PINATA_URL = import.meta.env.VITE_PINATA_URL;

let axiosInstance: AxiosInstance;

const _createAxios = (url: string, token?: string | null, headers?: Record<string, string>): AxiosInstance => {
  const instance = axios.create({
    baseURL: url,
    headers: headers || {}
  });

//   instance.interceptors.request.use(
//     (config) => {
//     const tokens = localStorage.getItem('token');
//     if(token){
//         config.headers.Authorization = `Bearer ${token}`;
//     } else if (tokens) {
//       config.headers.Authorization = `Bearer ${tokens}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );


  return instance;
};

const createAxios = (token?: string | null): AxiosInstance => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
//   if (token) {
//     localStorage.setItem('token', token);
//     headers.Authorization = `Bearer ${token}`;
//   }

  axiosInstance = _createAxios(API_URL, token, headers);

  return axiosInstance;
};


const uploadAxios = (token?: string | null): AxiosInstance => {
  const headers: Record<string, string> = {
    'Content-type': 'multipart/form-data',
  };

  axiosInstance = _createAxios(API_URL, token, headers);
  return axiosInstance;
};

const pinataAxios = (): AxiosInstance => {
  return axios.create({
    baseURL: PINATA_URL,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
    },
  });
};

export { axiosInstance, createAxios, uploadAxios, pinataAxios };
