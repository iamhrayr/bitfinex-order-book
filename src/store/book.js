import { createSlice } from "@reduxjs/toolkit";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    prec: "P0",
    asks: [],
    bids: [],
  },
  reducers: {
    updatePrec: (state, action) => {
      state.prec = action.payload;
    },
    updateAsks: (state, action) => {
      state.asks = action.payload;
    },
    updateBids: (state, action) => {
      state.bids = action.payload;
    },
  },
});

// actions
export const { updatePrec, updateAsks, updateBids } = bookSlice.actions;

// selectors
export const selectBids = (state) => state.book.bids;
export const selectAsks = (state) => state.book.asks;
export const selectPrec = (state) => state.book.prec;

// reducer
export default bookSlice.reducer;
