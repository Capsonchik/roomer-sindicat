import { createSlice } from '@reduxjs/toolkit'
import {fetchLogIn} from "./main.actions";

const initialState = {
  startPage: 'logIn',
  isAuth: false,
  user: null,
  logInLoader: false,
  stepOneData: ['Пиво', 'Коньяк', 'Сидр', 'Вино', 'Виски', 'Шампанское', 'Текила', 'Абсент'],
  stepOneValues: []
}

export const mainSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setStartPage: (state, action) => {
      state.startPage = action.payload;
    },
    setAuthStatus: (state, action) => {
      state.isAuth = action.payload;
    },
    setLogInLoader: (state, action) => {
      state.logInLoader = action.payload;
    },
    setStepOneValues: (state, action) => {
      state.stepOneValues =  action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLogIn.fulfilled, (state, action) => {
        state.logInLoader = false;
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(fetchLogIn.pending, (state, action) => {
        state.logInLoader = true;
      })
  }
})

export const {
  setStartPage,
  setAuthStatus,
  setLogInLoader,
  setStepOneValues
} = mainSlice.actions

export default mainSlice.reducer