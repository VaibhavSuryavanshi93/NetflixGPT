import Navbar from "./Navbar";
import { API_OPTIONS } from "../utils/constants";
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import MainContainer from "./MainContainer";
import SecondaryContainer from "./SecondaryContainer";
import usePopularMovies from "../hooks/usePopularMovies";
import useHighRatedMovies from "../hooks/useHighRatedMovies";
import useTrendingMovies from "../hooks/useTrendingMovies";
import useUpcomingMovies from "../hooks/UseUpcomingMovies";
import Footer from "./Footer";
import GptSearch from "./GptSearch";
import { useSelector } from "react-redux";

const Browse = () => {
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  useNowPlayingMovies();
  usePopularMovies();
  useHighRatedMovies();
  useTrendingMovies();
  useUpcomingMovies();
  return (
    <div>
      <Navbar />
      {showGptSearch ? (
        <GptSearch />
      ) : (
        <>
          <MainContainer />
          <SecondaryContainer />
        </>
      )}
      {/* <GptSearch />
      <MainContainer />
      <SecondaryContainer /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default Browse;
