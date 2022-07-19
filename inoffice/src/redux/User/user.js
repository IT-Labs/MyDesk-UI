import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: {
    decodedUser: null,
  },
  reducers: {
    setDecodedUser: (state, action) => {
      state.decodedUser = action.payload;
    },
  },
});

export const { setDecodedUser } = userSlice.actions;

export default userSlice.reducer;
