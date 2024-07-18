import {createSlice} from "@reduxjs/toolkit";
import {fetchGetAllClients, fetchGetClientReports, fetchGetGraphs} from "./reportSlice.actions";

const initialState = {
  allClients: [],
  clientLoader: false,
  currentClient: null,
  clientReports: [],
  reportLoader: false,
  currentReport: null,
  graphs: null
}

export const reportSlice = createSlice({
  name: 'reportSlice',
  initialState,
  reducers: {
    setCurrentClient: (state, action) => {
      state.currentClient = action.payload;
    },
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
      .addCase(fetchGetClientReports.fulfilled, (state, action) => {
        state.clientReports = action.payload;
      })
      .addCase(fetchGetGraphs.fulfilled, (state, action) => {
        state.graphs = action.payload;
      })
  }
})

export const {
  setCurrentClient
} = reportSlice.actions;

export default reportSlice.reducer;