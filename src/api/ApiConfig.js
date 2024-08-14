import axios from "axios";

export const LOGIN_API = 'https://192.168.9.239/'

const createAxiosLoginInstance = () => {
  const instance = axios.create({
    baseURL: LOGIN_API,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Language': 'ru',
      "ngrok-skip-browser-warning": 'true',
    },
    withCredentials: true
  });

  return instance;
};

export const axiosLoginRequest = createAxiosLoginInstance();



// export const CLIENT_API = 'http://192.168.9.239:8808/'
export const CLIENT_API = 'https://27ac-212-45-6-6.ngrok-free.app';

const createAxiosClientInstance = () => {
  const instance = axios.create({
    baseURL: CLIENT_API,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': 'ru',
      "ngrok-skip-browser-warning": 'true',
    },
    // withCredentials: true
  });

  // Перехватчик для обработки ошибок
  instance.interceptors.response.use(
    response => response, // Просто возвращаем ответ, если все хорошо
    async error => {
      const { config, response } = error;
      const originalRequest = config;

      // Если статус 500, пробуем повторить запрос
      if (response && response.status === 500) {
        try {
          // Повторяем запрос
          return await instance(originalRequest);
        } catch (retryError) {
          // Если повторный запрос также провалился, выбрасываем ошибку
          return Promise.reject(retryError);
        }
      }

      // Если ошибка не 500, выбрасываем её как есть
      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosClientRequest = createAxiosClientInstance();




export const GRAPH_API = 'https://27ac-212-45-6-6.ngrok-free.app'

const createAxiosGraphnstance = () => {
  const instance = axios.create({
    baseURL: GRAPH_API,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': 'ru',
      "ngrok-skip-browser-warning": 'true',
    },
  });

  return instance;
};

export const axiosGraphRequest = createAxiosGraphnstance();

