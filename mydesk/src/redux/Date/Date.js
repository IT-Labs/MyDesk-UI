import { createSlice } from "@reduxjs/toolkit";

const dateSlice = createSlice({
  name: "date",
  initialState: {
    start: null,
    end: null,
  },
  reducers: {
    setStart: (state, action) => {
      state.start = action.payload;
    },
    setEnd: (state, action) => {
      state.end = action.payload;
    },
  },
});

export const { setStart, setEnd } = dateSlice.actions;

export default dateSlice.reducer;
