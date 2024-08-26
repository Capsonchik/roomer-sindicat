import {createSlice} from "@reduxjs/toolkit";
import {
  fetchAllCharts, fetchAllChartsByGroupId, fetchAllChartsFormatByGroupId,
  fetchAllClients, fetchAllGroups,
  // fetchAllGroups,
  fetchAllReports,
  fetchChartById,
  patchChartById, patchGroupById
} from "./chart.actions";
import {fa} from "@faker-js/faker";

const initialState = {
  clients: [],
  activeClient: null,
  reports: [],
  activeReport: null,
  groupsChart: [],
  charts: [],
  activeChart: null,
  activeGroupId: null,
  isChartLoading: false,
  currentGraph: null,
  currentChartLoading: false,
  axes: null,
  saveChartLoading: false,

  isOpenDrawer: false,
  originalColors: []
}

export const chartSlice = createSlice({
  name: 'chartSlice',
  initialState,
  reducers: {
    setAxes: (state, action) => {
      state.axes = action.payload;
    },
    setActiveClient: (state, action) => {
      state.activeClient = action.payload;
    },
    setActiveReport: (state, action) => {
      state.activeReport = action.payload;
    },
    setActiveChart: (state, action) => {
      state.activeChart = action.payload;
    },
    setOpenDrawer: (state, action) => {
      state.isOpenDrawer = action.payload;
    },
    setOriginalColors: (state, action) => {
      state.originalColors = action.payload;
    },
    setActiveGroup: (state, action) => {
      state.activeGroupId = action.payload;
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
        // console.log(action.payload)
        state.reports = action.payload
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        // console.log(action.payload)
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
          // console.log(chart,action.payload)
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
      // .addCase(patchGroupById.fulfilled, (state, action) => {
      //   state.saveChartLoading = false
      // })

  }
})

export const {setActiveGroup,setOriginalColors,setOpenDrawer,setActiveChart,setAxes,setActiveClient,setActiveReport} = chartSlice.actions;

export default chartSlice.reducer;