import {createSlice} from "@reduxjs/toolkit";
import {fetchGetAllClients} from "./reportSlice.actions";

const initialState = {
  allClients: [],
  clientLoader: false,
  currentClient: null,
  clientReports: [],
  reportLoader: false,
  currentReport: null
}

export const reportSlice = createSlice({
  name: 'reportSlice',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetAllClients.fulfilled, (state, action) => {
        state.clientLoader = false
        state.allClients = action.payload;
      })
      .addCase(fetchGetAllClients.pending, (state) => {
        state.clientLoader = true
      })
  }
})

export const {

} = reportSlice.actions;

export default reportSlice.reducer;