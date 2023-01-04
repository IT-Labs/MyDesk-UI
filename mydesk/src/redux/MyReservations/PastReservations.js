import { createSlice } from "@reduxjs/toolkit";

const pastResSlice = createSlice({
  name: "Past Reservations",
  initialState: {
    pastReservations: [],
  },
  reducers: {
    setPastReservations: (state, action) => {
      state.pastReservations = action.payload;
    },
  },
});

export const { setPastReservations } = pastResSlice.actions;

export default pastResSlice.reducer;
