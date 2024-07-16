import { createSlice } from '@reduxjs/toolkit'
import {fetchLogIn} from "./main.actions";

const initialState = {
  toggleMenu: false,
  startPage: 'logIn',
  isAuth: false,
  user: null,
  logInLoader: false,
  stepOneData: ['Пиво', 'Коньяк', 'Сидр', 'Вино', 'Виски', 'Шампанское', 'Текила', 'Абсент'],
  stepOneValues: [],
  clientList: '',
  reportList: '',
  reports: ''
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
    },
    setToggleMenu: (state, action) => {
      state.toggleMenu = action.payload;
    },
    setClientList: (state, action) => {
      state.clientList = action.payload;
    },
    setReportList: (state, action) => {
      state.reportList = action.payload;
    },
    setReports: (state, action) => {
      state.reports = action.payload;
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
  setStepOneValues,
  setToggleMenu,
  setClientList,
  setReportList,
  setReports
} = mainSlice.actions

export default mainSlice.reducer