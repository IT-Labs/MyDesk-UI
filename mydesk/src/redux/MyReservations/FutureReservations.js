import { createSlice } from "@reduxjs/toolkit";

const futureResSlice = createSlice({
  name: "Future Reservations",
  initialState: {
    futureReservations: [],
  },
  reducers: {
    setFutureReservation: (state, action) => {
      state.futureReservations = action.payload;
    },
  },
});

export const { setFutureReservation } = futureResSlice.actions;

export default futureResSlice.reducer;
