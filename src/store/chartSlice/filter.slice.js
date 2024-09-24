import {createSlice} from "@reduxjs/toolkit";
import {
  deleteChartById,
  deleteGroupById,
  fetchAllCharts, fetchAllChartsByGroupId, fetchAllChartsFormatByGroupId,
  fetchAllClients, fetchAllGroups,
  // fetchAllGroups,
  fetchAllReports,
  fetchChartById,
  patchChartById, patchGroupById, postGroup
} from "./chart.actions";
import {fa} from "@faker-js/faker";
import {createFilter, getFilters} from "./filter.actions";

const initialState = {
  activeFilters: {},

}

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const {data, activeGroupId} = action.payload
      // if (!state.activeFilters[activeGroupId]) {
        state.activeFilters[activeGroupId] = data;
      // }
      // else {
      //   state.activeFilters[activeGroupId] = data;
      // }
    },


  },
  extraReducers: builder => {
    // builder
    //   // .addCase(fetchAllCharts.fulfilled, (state, action) => {
    //   //   state.graphs = action.payload;
    //   //   state.currentChartLoading = false
    //   // })

  }
})

export const {setFilters} = filterSlice.actions;

export default filterSlice.reducer;

export const selectActiveFilters = (state) => state.filters.activeFilters;