import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    initialDesk: [],
  },
  reducers: {
    setInitialDesks: (state, action) => {
      state.initialDesk = action.payload;
    },
  },
});

export const { setInitialDesks } = dashboardSlice.actions;

export default dashboardSlice.reducer;
