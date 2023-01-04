import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: {
    loggedUser: null
  },
  reducers: {
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    }
  },
});

export const { setLoggedUser } = userSlice.actions;

export default userSlice.reducer;
