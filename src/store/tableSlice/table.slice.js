import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  compact: true,
  bordered: true,
  showHeader: true,
  hover: true,
  autoHeight: true,
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
    }
  }
})

export const {
  setTableAutoHeight,
  setTableHover,
  setTableShowHeader,
  setTableCompact,
  setTableBordered,
} = tableSlice.actions;

export default tableSlice.reducer;