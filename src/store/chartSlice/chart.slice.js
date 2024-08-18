import {createSlice} from "@reduxjs/toolkit";
import {fetchAllCharts, fetchChartById, patchChartById} from "./chart.actions";
import {fa} from "@faker-js/faker";

const initialState = {
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
        // state.graphs = state.graphs.map(graph => {
        //   if (graph.id === action.payload.id) {
        //     return action.payload;
        //   }
        //   return graph
        // })
      })
      .addCase(patchChartById.pending, (state, action) => {
        state.saveChartLoading = true
      })

  }
})

export const {setAxes} = chartSlice.actions;

export default chartSlice.reducer;