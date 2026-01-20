import React, { useRef, useState } from "react";
import lang from "../utils/languageConstant";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import client from "../utils/openai";
import axios from "axios";
import { API_OPTIONS } from "../utils/constants";
import { addGptMovieResults } from "../utils/gptSlice";
import { setGptLoading } from "../utils/uiSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const [loading, setLoader] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);

  const startCooldown = () => {
    setCooldown(true);
    setTimeout(() => setCooldown(false), 5000);
  };

  const filterExactMovie = (movies, query) => {
    const q = query.toLowerCase().trim();
    return movies.filter((movie) => movie.title?.toLowerCase().includes(q));
  };

  const SearchMovieTMDB = async (movie) => {
    const data = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`,
      API_OPTIONS
    );
    return data.data.results;
  };

  const handleGptSearchClick = async () => {
    const queryText = searchText.current.value?.trim();

    if (!queryText) {
      toast.info("Please enter a movie name!");
      return;
    }

    if (cooldown) {
      toast.warning("Please wait a few seconds before trying again");
      return;
    }

    setLoader(true);
    startCooldown();

    const gptQuery =
      "Act as a Movie Recommendation system and suggest 5 movies for: " +
      queryText +
      ". Only give comma separated names.";

    try {
      dispatch(setGptLoading(true));
      // ✅ CALL GPT
      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: gptQuery }],
      });

      const content = completion?.choices?.[0]?.message?.content;

      // ❌ GPT FAILED → TMDB fallback
      if (!content) {
        toast.warning("AI failed. Showing TMDB results instead.");

        const data = await SearchMovieTMDB(queryText);
        const exactMatches = filterExactMovie(data, queryText);

        dispatch(
          addGptMovieResults([
            {
              title: "Search Results",
              movies: exactMatches.length ? exactMatches : exactMatches,
            },
          ])
        );

        return;
      }

      // ✅ GPT SUCCESS
      const movieNames = content.split(",").map((m) => m.trim());

      const tmdbResults = await Promise.all(
        movieNames.map((movie) => SearchMovieTMDB(movie))
      );

      const mergedMovies = tmdbResults.flat();

      dispatch(
        addGptMovieResults([
          {
            title: "AI Recommendations",
            movies: mergedMovies,
          },
        ])
      );

      toast.success("Movies loaded!");
    } catch (err) {
      console.error(err);

      if (err?.response?.status === 429 || err?.message?.includes("rate")) {
        toast.error("⚠️ Too many requests. Please wait 1 minute.");
        return;
      }

      toast.warning("AI crashed. Showing TMDB results instead.");

      try {
        const data = await SearchMovieTMDB(queryText);
        const exactMatches = filterExactMovie(data, queryText);

        dispatch(
          addGptMovieResults([
            {
              title: "Search Results",
              movies: exactMatches.length ? exactMatches : exactMatches,
            },
          ])
        );
      } catch (tmdbErr) {
        toast.error("TMDB also failed. Try later.",tmdbErr);
      }
    } finally {
      setLoader(false);
      dispatch(setGptLoading(false));
    }
  };

  return (
    <div className="pt-[35%] md:pt-[10%] flex justify-center">
      <form
        className="w-full md:w-1/2 bg-black grid grid-cols-12"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchText}
          type="text"
          className="p-4 m-4 col-span-9 text-white"
          placeholder={lang[langKey].gptSearchPlaceholder}
        />

        <button
          className="col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg flex items-center justify-center hover:bg-red-800 transition duration-300 cursor-pointer hover:text-gray-300 disabled:bg-gray-600"
          onClick={handleGptSearchClick}
          disabled={loading || cooldown}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            lang[langKey].search
          )}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
