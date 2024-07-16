import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  userName: '',
  currentUser: '',
  role: ''
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
  }
})

export const {
  setCurrentUser,
  setRole,
  setUserName
} = userSlice.actions;

export default userSlice.reducer;