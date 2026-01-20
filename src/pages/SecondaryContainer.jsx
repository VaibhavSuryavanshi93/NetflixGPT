import React from "react";
import MovieList from "./MovieList";
import { useSelector } from "react-redux";
import Footer from "./Footer";

const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);
  const heroLoading = useSelector((store) => store.ui.heroLoading);

  if (heroLoading || !movies) {
    return <MovieListSkeleton />;
  }
  return (
    movies.nowPlayingMovies && (
      <div className="bg-black">
        <div className="lg:-mt-52 -mt-18 lg:pl-12 relative z-20  ">
          <MovieList title={"Now Playing"} movies={movies.nowPlayingMovies} />
          <MovieList title={"Trending"} movies={movies.trendingMovies} />
          <MovieList title={"Popular"} movies={movies.popularMovies} />
          <MovieList title={"upcoming Movies"} movies={movies.upcomingMovies} />
          <MovieList
            title={"High rated Movies"}
            movies={movies.highRatedMovies}
          />
        </div>
        <Footer/>
      </div>
    )
  );
};

export default SecondaryContainer;
