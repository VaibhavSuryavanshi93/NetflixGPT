import { useSelector } from "react-redux";
import MovieList from "./MovieList";
import MovieListSkeleton from "../skeleton/MovieListSkeleton";

const GptMovieSuggestions = () => {
  const gptMovies = useSelector((store) => store.gpt.gptMovies);
  const loading = useSelector((store) => store.ui.loading);

  if (loading) {
    return (
      <>
        <MovieListSkeleton />
        <MovieListSkeleton />
      </>
    );
  }

  if (!gptMovies || gptMovies.length === 0) return null;

  return (
    <div className="p-4 m-4 bg-black/80 text-white bg-opacity-90">
      {gptMovies.map((section, index) => (
        <MovieList key={index} title={section.title} movies={section.movies} />
      ))}
    </div>
  );
};

export default GptMovieSuggestions;
