import {createSlice} from "@reduxjs/toolkit";
import {fetchGetUser, fetchLogIn, fetchPostLogOut} from "../main.actions";

const initialState = {
  isAuth: false,
  user: null,
  userName: '',
  email: '',
  currentUser: '',
  role: '',
  userLoader: 'none'
}

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLogIn.fulfilled, (state, action) => {
        state.userLoader = false
        state.isAuth = true
      })
      .addCase(fetchLogIn.pending, (state, action) => {
        state.userLoader = true
      })
      .addCase(fetchGetUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.userLoader = 'idle'
      })
      .addCase(fetchGetUser.pending, (state, action) => {
        state.userLoader = 'load'
      })
      .addCase(fetchGetUser.rejected, (state, action) => {
        state.userLoader = 'idle'
      })
      .addCase(fetchPostLogOut.fulfilled, (state, action) => {
        state.userLoader = 'none'
        state.user = null
      })
  }
})

export const {
  setCurrentUser,
  setRole,
  setUserName
} = userSlice.actions;

export default userSlice.reducer;