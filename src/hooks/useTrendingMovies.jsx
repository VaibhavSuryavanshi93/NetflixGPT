import axios from "axios";
import React, { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addTrendingMovies } from "../utils/movieSlice";

const useTrendingMovies = () => {
  const dispatch = useDispatch();
  const trending = async () => {
    const response = await axios.get(
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
      API_OPTIONS
    );
    const trendingMovie = response.data.results;
    dispatch(addTrendingMovies(trendingMovie));
  };
  useEffect(() => {
    trending();
  }, []);
};

export default useTrendingMovies;
