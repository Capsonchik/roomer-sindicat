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
import {createFilter, getFilterOriginalValues, getFilters} from "./filter.actions";

const initialState = {
  activeFilters: {},
  originValuesLoading: false,
  selectedFilters: [],

  activeSavedFilters: null,
  toogleFilters: true,
}

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setToggleFilters: (state, action) => {
      state.toogleFilters= action.payload;
    },
    setSelectedFilters: (state, action) => {
      state.selectedFilters= action.payload;
    },
    setFilters: (state, action) => {
      const {data, activeGroupId} = action.payload
      state.activeFilters[activeGroupId] = data;

    },
    setActiveSavedFilters: (state, action) => {
      // if (!state.activeFilters[activeGroupId]) {
      state.activeSavedFilters = action.payload;
      // }
      // else {
      //   state.activeFilters[activeGroupId] = data;
      // }
    },
    removeFilter: (state, action) => {
      const {activeGroupId} = action.payload
      // if (!state.activeFilters[activeGroupId]) {
      delete state.activeFilters[activeGroupId];
    },
    removeFilters: (state, action) => {
      state.activeFilters = {}
    }


  },
  extraReducers: builder => {
    builder
      .addCase(getFilterOriginalValues.pending, (state, action) => {
        state.originValuesLoading = true;
      })
      .addCase(getFilterOriginalValues.fulfilled, (state, action) => {
        state.originValuesLoading = false;
      })

  }
})

export const {setToggleFilters,setSelectedFilters,setActiveSavedFilters,removeFilters,removeFilter,setFilters} = filterSlice.actions;

export default filterSlice.reducer;

export const selectActiveFilters = (state) => state.filters.activeFilters;