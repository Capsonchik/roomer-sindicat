import {createSlice} from "@reduxjs/toolkit";
import {
  fetchAllCharts, fetchAllChartsByGroupId, fetchAllChartsFormatByGroupId,
  fetchAllClients, fetchAllGroups,
  // fetchAllGroups,
  fetchAllReports,
  fetchChartById,
  patchChartById
} from "./chart.actions";
import {fa} from "@faker-js/faker";

const initialState = {
  clients: [],
  reports: [],
  groupsChart: [],
  charts: [],
  isChartLoading: false,
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
        console.log(action.payload)
        state.reports = action.payload
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        console.log(action.payload)
        state.groupsChart = action.payload
      })
      .addCase(fetchAllChartsByGroupId.fulfilled, (state, action) => {
        state.charts = action.payload
        // state.isChartLoading = false
      })
      .addCase(fetchAllChartsByGroupId.pending, (state, action) => {
        // state.charts = action.payload
        state.isChartLoading = true
      })
      .addCase(fetchAllChartsFormatByGroupId.fulfilled, (state, action) => {
        state.charts = state.charts.map((chart,i) => {
          console.log(chart,action.payload)
          // const foundFormat = action.payload.find(f => f.id === chart.id)
          // if(foundFormat) {
            return {
              ...chart,
              ...action.payload[i],
            // }
          }
        })
        state.isChartLoading = false
      })
      .addCase(patchChartById.pending, (state, action) => {
        state.saveChartLoading = true
      })

  }
})

export const {setAxes} = chartSlice.actions;

export default chartSlice.reducer;