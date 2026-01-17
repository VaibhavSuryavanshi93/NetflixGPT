import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    gptLoading: false,
    heroLoading: false,
  },
  reducers: {
    setGptLoading: (state, action) => {
      state.gptLoading = action.payload;
    },
    setHeroLoading: (state, action) => {
      state.heroLoading = action.payload;
    },
  },
});

export const { setGptLoading, setHeroLoading } = uiSlice.actions;

export default uiSlice.reducer;
