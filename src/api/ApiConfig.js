import axios from "axios";

export const LOGIN_API = 'https://82b0-212-45-6-6.ngrok-free.app'

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
export const CLIENT_API = 'https://4ffd-212-45-6-6.ngrok-free.app';

const createAxiosClientInstance = () => {
  const instance = axios.create({
    baseURL: CLIENT_API,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': 'ru',
      "ngrok-skip-browser-warning": 'true',
    },
    withCredentials: true
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


const GRAPH_API = `${LOGIN_API}/api/routes`


const createAxiosGraphnstance = () => {
  const instance = axios.create({
    baseURL: GRAPH_API,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': 'ru',
      "ngrok-skip-browser-warning": 'true',
    },
    withCredentials: true  // Это гарантирует отправку куков
  });

  // Добавляем интерсепторы для обработки ошибок
  instance.interceptors.request.use((config) => {
    console.log('Куки отправляются с запросом:', document.cookie);  // Проверяем, что куки присутствуют
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      // Возвращаем ответ, если всё прошло успешно
      return response;
    },
    (error) => {
      if (error.response) {
        console.error('Ошибка на стороне сервера:', error.response);
        throw new Error(JSON.stringify(error.response) || 'Ошибка на сервере');
      } else if (error.request) {
        console.error('Нет ответа от сервера:', error.request);
        throw new Error('Нет ответа от сервера');
      } else {
        console.error('Ошибка при настройке запроса:', error.message);
        throw new Error('Ошибка при настройке запроса');
      }
    }
  );

  return instance;
};



export const axiosGraphRequest = createAxiosGraphnstance();

