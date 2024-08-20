import {createSlice} from "@reduxjs/toolkit";
import {
  fetchAllCharts,
  fetchAllClients,
  fetchAllGroups,
  fetchAllReports,
  fetchChartById,
  patchChartById
} from "./chart.actions";
import {fa} from "@faker-js/faker";

const initialState = {
  clients:[],
  reports: [],
  groups: [],
  graphs: [],
  currentGraph: null,
  currentChartLoading: false,
  axes: null,
  saveChartLoading: false,
}

export const chartSlice = createSlice({
  name: 'chartSlice',
  initialState,
  reducers: {
    setAxes: (state, action) => {
      state.axes = action.payload;
    },

  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllCharts.fulfilled, (state, action) => {
        state.graphs = action.payload;
        state.currentChartLoading = false
      })
      .addCase(fetchChartById.fulfilled, (state, action) => {
        state.currentGraph = action.payload;
        state.currentChartLoading = false
      })
      .addCase(fetchChartById.pending, (state, action) => {
        state.currentChartLoading = true
      })
      .addCase(patchChartById.fulfilled, (state, action) => {
        state.saveChartLoading = false

      })
      .addCase(fetchAllClients.fulfilled, (state, action) => {
        state.clients = action.payload

      })
      .addCase(fetchAllReports.fulfilled, (state, action) => {
        state.reports = action.payload
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.groups = action.payload
      })
      .addCase(patchChartById.pending, (state, action) => {
        state.saveChartLoading = true
      })

  }
})

export const {setAxes} = chartSlice.actions;

export default chartSlice.reducer;