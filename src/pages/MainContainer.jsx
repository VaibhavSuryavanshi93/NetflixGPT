// import React from "react";
// import { useSelector } from "react-redux";
// import VidoeBackground from "./VidoeBackground";
// import VideoTitle from "./VideoTitle";

// const MainContainer = () => {
//   const movies = useSelector((store) => store.movies?.nowPlayingMovies);

//   if (!movies) return; // It is also know as Early return if movies is NULL it not give error!

//   const mainMovie = movies[0];
//   const { original_title, overview, id } = mainMovie;
//   return (
//     <div className="pt-[30%] bg-black md:pt-0">
//       <VideoTitle title={original_title} overview={overview} />
//       <VidoeBackground movieId={id} />
//     </div>
//   );
// };

// export default MainContainer;

import React from "react";
import { useSelector } from "react-redux";
import VidoeBackground from "./VidoeBackground";
import VideoTitle from "./VideoTitle";
import MainContainerSkeleton from "../skeleton/MainContainerSkeleton";


const MainContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  const heroLoading = useSelector((store) => store.ui.heroLoading);

  if (heroLoading || !movies) {
    return <MainContainerSkeleton />;
  }

  const mainMovie = movies[2];

  return (
    <div className=" bg-black md:pt-0">
      <VideoTitle

        title={mainMovie.original_title}
        overview={mainMovie.overview}
        rating={mainMovie.vote_average}
        releaseDate={mainMovie.release_date}
      />
      <VidoeBackground movieId={mainMovie.id} />
    </div>
  );
};


export default MainContainer;
