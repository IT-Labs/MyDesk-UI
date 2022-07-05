import { createSlice } from "@reduxjs/toolkit";

const cardSlice = createSlice({
  name: "Card",
  initialState: {
    initialDesks: [],
  },
  reducers: {
    setInitialDesks: (state, action) => {
      state.initialDesks = action.payload;
    },
  },
});

export const { setInitialDesks } = cardSlice.actions;

export default cardSlice.reducer;
