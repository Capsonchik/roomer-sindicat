import {createSlice} from "@reduxjs/toolkit";
import {fetchLogIn} from "../main.actions";

const initialState = {
  isAuth: false,
  user: '',
  userName: '',
  currentUser: '',
  role: '',
  userLoader: false
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
  }
})

export const {
  setCurrentUser,
  setRole,
  setUserName
} = userSlice.actions;

export default userSlice.reducer;