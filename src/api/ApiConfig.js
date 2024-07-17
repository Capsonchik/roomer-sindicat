import axios from "axios";

export const LOGIN_API = 'https://192.168.9.239/'

const createAxiosLoginInstance = () => {
  const instance = axios.create({
    baseURL: LOGIN_API,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Language': 'ru',
    },
    withCredentials: true
  });

  return instance;
};

export const axiosLoginRequest = createAxiosLoginInstance();



export const CLIENT_API = 'http://192.168.9.239:8808/'

const createAxiosClientInstance = () => {
  const instance = axios.create({
    baseURL: CLIENT_API,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Language': 'ru',
    },
    withCredentials: true
  });

  return instance;
};

export const axiosClientRequest = createAxiosLoginInstance();