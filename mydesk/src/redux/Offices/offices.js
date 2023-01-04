import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../helper/api";

export const fetchOffices = createAsyncThunk("offices/getOffices", async () => {
  try {
    const response = await api("admin/offices");
    return response.data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {}
});

const officesSlice = createSlice({
  name: "Offices",
  initialState: {
    offices: [],
  },
  extraReducers: {
    [fetchOffices.fulfilled]: (state, action) => {
      state.offices = action.payload;
    },
  },
});

export default officesSlice.reducer;
