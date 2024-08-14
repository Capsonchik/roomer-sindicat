import {createSlice} from "@reduxjs/toolkit";
import {fetchAllCharts, fetchChartById} from "./chart.actions";

const initialState = {
  graphs: [],
  currentGraph: null,
  currentChartLoading: false,
}

export const chartSlice = createSlice({
  name: 'chartSlice',
  initialState,
  reducers: {
    // setCurrentUser: (state, action) => {
    //   state.currentUser = action.payload;
    // },

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

export const {} = chartSlice.actions;

export default chartSlice.reducer;