import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosLoginRequest} from "../api/ApiConfig";

export const fetchLogIn = createAsyncThunk(
  'logIn',
  async (userData) => {
    try {
      const response = await axiosLoginRequest.post(`auth/jwt/login`, userData);
      if (response.status === 200) {
        return response.data;
      } else {
        return 'error';
      }
    } catch (error) {
      return 'throwError(error)';
    }
  }
);

export const fetchGetUser = createAsyncThunk(
  'user',
  async (userData) => {
    try {
      const response = await axiosLoginRequest.get(`users/me`);
      if (response.status === 200) {
        return response.data;
      } else {
        return 'error';
      }
    } catch (error) {
      return 'throwError(error)';
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
      } else {
        return 'error';
      }
    } catch (error) {
      return 'throwError(error)';
    }
  }
);