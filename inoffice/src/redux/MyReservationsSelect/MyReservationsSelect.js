import { createSlice } from "@reduxjs/toolkit";

const reservationSelectSlice = createSlice({
  name: "Reservation Office Select",
  initialState: {
    officeSelect: "",
  },
  reducers: {
    setOfficeSelect: (state, action) => {
      state.officeSelect = action.payload;
    },
  },
});

export const { setOfficeSelect } = reservationSelectSlice.actions;

export default reservationSelectSlice.reducer;
