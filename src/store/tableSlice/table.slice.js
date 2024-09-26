import {createSlice} from "@reduxjs/toolkit";
import {DEFAULT_COLUMNS} from "../../consts/tableMocks";

const initialState = {
  compact: true,
  bordered: true,
  showHeader: true,
  hover: true,
  autoHeight: true,
  sort: false,
  resize: true,
  sortColumn: null,
  sortType: null,
  loading: false,
  draggable: false,
  columnKeys: DEFAULT_COLUMNS.map(column => column.key),
  sittings: {}
}

export const tableSlice = createSlice({
  name: "tableSlice",
  initialState,
  reducers: {
    setColumnKeys(state, action) {
      state.columnKeys = action.payload;
    },
    setTableSortColumn(state, action) {
      state.sortColumn = action.payload.column;
      state.sortType = action.payload.type;
    },
    setTableLoading(state, action) {
      state.loading = action.payload;
    },
    setTableSittings(state, action) {
      state.sittings = action.payload;
    },
    setSittingsCompact(state, action) {
      state.sittings.compact = action.payload;
    },
    setSittingsBordered(state, action) {
      state.sittings.bordered = action.payload;
    },
    setSittingsShowHeader(state, action) {
      state.sittings.showHeader = action.payload;
    },
    setSittingsHover(state, action) {
      state.sittings.hover = action.payload;
    },
    setSittingsAutoHeight(state, action) {
      state.sittings.autoHeight = action.payload;
    },
    setSittingsSort(state, action) {
      state.sittings.sort = action.payload;
    },
    setSittingsResize(state, action) {
      state.sittings.resize = action.payload;
    },
    setSittingsDraggable(state, action) {
      state.sittings.draggable = action.payload;
    }
  }
})

export const {
  setColumnKeys,
  setTableLoading,
  setTableSortColumn,
  setTableSittings,
  setSittingsCompact,
  setSittingsSort,
  setSittingsAutoHeight,
  setSittingsBordered,
  setSittingsDraggable,
  setSittingsHover,
  setSittingsResize,
  setSittingsShowHeader
} = tableSlice.actions;

export default tableSlice.reducer;