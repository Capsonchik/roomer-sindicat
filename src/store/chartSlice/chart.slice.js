import {createSlice} from "@reduxjs/toolkit";
import {
  deleteChartById,
  deleteGroupById,
  fetchAllCharts, fetchAllChartsByGroupId, fetchAllChartsFormatByGroupId,
  fetchAllClients, fetchAllGroups,
  // fetchAllGroups,
  fetchAllReports,
  fetchChartById, getChartTypes,
  patchChartById, patchGroupById, postGroup
} from "./chart.actions";
import {fa} from "@faker-js/faker";
import {createFilter, getFilters, postDependentFilters} from "./filter.actions";

const initialState = {
  clients: [],
  activeClient: null,
  reports: [],
  activeReport: null,
  groupsChart: [],
  charts: [],
  chartTypes: [],
  activeChart: null,
  activeGroupId: null,
  isChartLoading: false,
  currentGraph: null,
  currentChartLoading: false,
  axes: null,
  saveChartLoading: false,

  isOpenDrawer: false,
  originalColors: [],

  typeGroupDrawer: 'edit',
  errorCharts: false,
  scrollTabs: 1,
  filters: [],
  filtersDrawer: [],
  filterLoading: 'none',
  isLoadDependentFilters: false,
  isEditableMode: false
}

export const chartSlice = createSlice({
  name: 'chartSlice',
  initialState,
  reducers: {
    setEditableMode: (state, action) => {
      state.isEditableMode = action.payload;
    },
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

    setTypeGroupDrawer: (state, action) => {
      state.typeGroupDrawer = action.payload;
    },
    setScrollTabs: (state, action) => {
      state.scrollTabs = action.payload;
    },
    setFilterLoading: (state, action) => {
      state.filterLoading = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setGroups: (state, action) => {
      state.groupsChart = action.payload;
    },
    setCharts: (state, action) => {
      state.charts = action.payload;
    },
    setDependentFilters: (state, action) => {
      const {originFilters, filters, activeFilterIndex} = action.payload
      // state.filters = state.filters.map((filter,index) => {
      //   if(activeFilterIndex >= index) {
      //     return filter;
      //   }
      //   else {
      //     return filters[index]
      //   }
      // })
      state.filters = originFilters.slice(0, activeFilterIndex + 1).concat(filters)
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
      .addCase(fetchAllChartsByGroupId.rejected, (state, action) => {
        state.errorCharts = true
        state.isChartLoading = false
        state.charts = []
      })
      .addCase(fetchAllChartsFormatByGroupId.fulfilled, (state, action) => {
        state.charts = state.charts.map((chart, i) => {
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
      .addCase(postGroup.fulfilled, (state, action) => {
        state.groupsChart.push(action.payload)
      })
      .addCase(patchGroupById.fulfilled, (state, action) => {
        state.groupsChart.map(group => {
          if (action.payload.group_id === group.group_id) {
            return action.payload
          }

          return group
        })
      })
      .addCase(deleteGroupById.fulfilled, (state, action) => {
        state.groupsChart = state.groupsChart.filter(chart => chart.group_id !== action.payload)
      })
      .addCase(deleteChartById.fulfilled, (state, action) => {
        state.charts = state.charts.filter(chart => chart.id !== action.payload)
      })
      .addCase(getFilters.fulfilled, (state, action) => {
        state.filters = action.payload
        state.filtersDrawer = action.payload
        state.filterLoading = 'idle'
      })
      .addCase(getFilters.pending, (state, action) => {
        state.filterLoading = 'load'
      })
      .addCase(postDependentFilters.fulfilled, (state, action) => {
        state.isLoadDependentFilters = false
      })
      .addCase(postDependentFilters.pending, (state, action) => {
        state.isLoadDependentFilters = true
      })

      .addCase(postDependentFilters.rejected, (state, action) => {
        state.isLoadDependentFilters = false
      })

      .addCase(getChartTypes.fulfilled, (state, action) => {
        state.chartTypes = action.payload
      })


  }
})

export const {
  setEditableMode,
  setDependentFilters,
  setCharts,
  setGroups,
  setFilters,
  setFilterLoading,
  setScrollTabs,
  setTypeGroupDrawer,
  setActiveGroup,
  setOriginalColors,
  setOpenDrawer,
  setActiveChart,
  setAxes,
  setActiveClient,
  setActiveReport
} = chartSlice.actions;

export default chartSlice.reducer;