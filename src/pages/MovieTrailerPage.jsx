import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieTrailerPlayer from "./MovieTrailerPlayer";
import { API_OPTIONS } from "../utils/constants";

const MovieTrailerPage = () => {
  const { movieId } = useParams();
  const [posterPath, setPosterPath] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        API_OPTIONS
      );
      setPosterPath(res.data.poster_path);
    } catch (err) {
      console.error("Failed to fetch movie details", err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <MovieTrailerPlayer movieId={movieId} posterPath={posterPath} />
    </div>
  );
};

export default MovieTrailerPage;
