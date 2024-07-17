import { configureStore } from '@reduxjs/toolkit'
import mainReducer from './main.slice'
import usersReducer from './userSlice/userSlice'
import reportReducer from './reportSlice/reportSlice'

export const store = configureStore({
  reducer: {
    main: mainReducer,
    user: usersReducer,
    reports: reportReducer,
  },
})