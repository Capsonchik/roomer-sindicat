import {createSlice} from "@reduxjs/toolkit";
import {fetchAllCharts, fetchChartById} from "./chart.actions";

const initialState = {
  graphs: [],
  currentGraph: null,
  currentChartLoading: false,
  axes: null
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
        state.currentChartLoading = true
      })

  }
})

export const {setAxes} = chartSlice.actions;

export default chartSlice.reducer;