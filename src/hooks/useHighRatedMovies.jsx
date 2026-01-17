import axios from "axios";
import React, { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addHighRatedMovies } from "../utils/movieSlice";

const useHighRatedMovies = () => {
  const dispatch = useDispatch();
  const getHighRatedMovies = async () => {
    const movie = await axios.get(
      "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
      API_OPTIONS
    );
    const response = movie.data.results;
    dispatch(addHighRatedMovies(response));
  };
  useEffect(() => {
    getHighRatedMovies();
  }, []);
};

export default useHighRatedMovies;
