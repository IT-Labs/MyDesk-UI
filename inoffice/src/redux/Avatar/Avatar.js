import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAvatar = createAsyncThunk("avatar/getAvatar", async () => {
  let image;
  await fetch("https://graph.microsoft.com/v1.0/me/photos/64x64/$value", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then((res) => res.blob())
    .then((imgBlob) => {
      const imageObjURL = URL.createObjectURL(imgBlob);
      image = imageObjURL;
    });

  return image;
});


const avatarSlice = createSlice({
  name: "avatar",
  initialState: {
    avatar: null,
  },
  reducers: {
    clearAvatar: (state, action) => {
      state.avatar = null;
    }
  },
  extraReducers: {
    [getAvatar.fulfilled]: (state, action) => {
      state.avatar = action.payload;
    }
  },
});

export const { clearAvatar } = avatarSlice.actions;
export default avatarSlice.reducer;
