import { configureStore } from '@reduxjs/toolkit'
import mainReducer from './main.slice'
import usersReducer from './userSlice/userSlice'

export const store = configureStore({
  reducer: {
    main: mainReducer,
    user: usersReducer
  },
})