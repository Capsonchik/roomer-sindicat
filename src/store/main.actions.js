import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosLoginRequest} from "../api/ApiConfig";

export const fetchLogIn = createAsyncThunk(
  'logIn',
  async (userData) => {
    try {
      const response = await axiosLoginRequest.post(`auth/jwt/login`, userData);
      if (response.status === 200) {
        console.log('post');
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchLogIn error');
    }
  }
);

export const fetchGetUser = createAsyncThunk(
  'user',
  async (userData) => {
    const token = localStorage.getItem('authToken')
    try {
      const response = await fetch(
        'https://aca1-212-45-6-6.ngrok-free.app/api/v1/users/me', {
          headers: {
            "Authorization": `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Language': 'ru',
            "ngrok-skip-browser-warning": 'true',
          }
        });
      if (response.status === 200) {
        const data = await response.json();
        console.log(data)
        return data;
      }
    } catch (error) {
      throw new Error('fetchGetUser error');
    }
  }
);


export const fetchPostLogOut = createAsyncThunk(
  'user/logOut',
  async (userData) => {
    try {
      const response = await axiosLoginRequest.post(`auth/jwt/logout`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchPostLogOut error');
    }
  }
);