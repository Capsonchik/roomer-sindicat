import {createSlice} from "@reduxjs/toolkit";
import {
  fetchGetAllClients,
  fetchGetAllGraphs,
  fetchGetClientReports,
  fetchGetGraphs,
  fetchGetGroups
} from "./reportSlice.actions";

const initialState = {
  allClients: [],
  clientLoader: false,
  currentClient: null,
  clientReports: [],
  reportLoader: false,
  currentReport: null,
  graphs: null,
  groups: null,
  groupId: null,
  reportId: null,
  reportTitle: '',
  allGraphs: [],
  tableLoader: false,
  error: false,
  isDrawerOpen: false,
  graphPreview: null
}

export const reportSlice = createSlice({
  name: 'reportSlice',
  initialState,
  reducers: {
    setCurrentClient: (state, action) => {
      state.currentClient = action.payload;
    },
    setGroupId: (state, action) => {
      state.groupId = action.payload;
    },
    setReportId: (state, action) => {
      state.reportId = action.payload;
    },
    setReportTitle: (state, action) => {
      state.reportTitle = action.payload;
    },
    clearGraphs: (state) => {
      state.graphs = [];
    },
    setIsDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
    setGraphPreview: (state, action) => {
      state.graphPreview = action.payload;
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
      .addCase(fetchGetGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      })
      .addCase(fetchGetAllGraphs.fulfilled, (state, action) => {
        state.allGraphs = action.payload;
        state.tableLoader = false
        state.error = false
      })
      .addCase(fetchGetAllGraphs.pending, (state) => {
        state.tableLoader = true
      })
      .addCase(fetchGetAllGraphs.rejected, (state) => {
        state.error = true
      })
  }
})

export const {
  setCurrentClient,
  setGroupId,
  setReportId,
  setReportTitle,
  clearGraphs,
  setIsDrawerOpen,
  setGraphPreview
} = reportSlice.actions;

export default reportSlice.reducer;