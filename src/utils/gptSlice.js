import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGptSearch: false,
    gptMovies: [], // ✅ always array
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addGptMovieResults: (state, action) => {
      state.gptMovies = action.payload; // array of sections
    },
    clearGptMovies: (state) => {
      state.gptMovies = [];
    },
  },
});

export const { toggleGptSearchView, addGptMovieResults, clearGptMovies } =
  gptSlice.actions;

export default gptSlice.reducer;
