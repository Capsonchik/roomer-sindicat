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
  columnKeys: DEFAULT_COLUMNS.map(column => column.key),
}

export const tableSlice = createSlice({
  name: "tableSlice",
  initialState,
  reducers: {
    setTableCompact: (state, action) => {
      state.compact = action.payload;
    },
    setTableBordered: (state, action) => {
      state.bordered = action.payload;
    },
    setTableShowHeader: (state, action) => {
      state.showHeader = action.payload;
    },
    setTableHover: (state, action) => {
      state.hover = action.payload;
    },
    setTableAutoHeight: (state, action) => {
      state.autoHeight = action.payload;
    },
    setColumnKeys(state, action) {
      state.columnKeys = action.payload;
    },
    setTableSort: (state, action) => {
      state.sort = action.payload;
    },
    setTableResize: (state, action) => {
      state.resize = action.payload;
    }
  }
})

export const {
  setTableAutoHeight,
  setTableHover,
  setTableShowHeader,
  setTableCompact,
  setTableBordered,
  setColumnKeys,
  setTableResize,
  setTableSort,
} = tableSlice.actions;

export default tableSlice.reducer;