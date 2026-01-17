// import React, { useRef } from "react";
// import lang from "../utils/languageConstant";
// import { useSelector } from "react-redux";
// import client from "../utils/openai";
// import axios from "axios";
// import { API_OPTIONS } from "../utils/constants";
// const GptSearchBar = () => {
//   const langKey = useSelector((store) => store.config.lang);
//   const searchText = useRef(null);
//   // Search Movie in TMDB API

//   const SearchMovieTMDB = async (movie) => {
//     const data = await axios.get(
//       "https://api.themoviedb.org/3/search/movie?query=" +
//         movie +
//         "&include_adult=false&language=en-US&page=1",
//       API_OPTIONS
//     );
//     const response = data.data.results;
//     return response;
//   };
//   const handleGptSearchClick = async () => {
//     searchText.current.value;
//     //  make an API call to get the movie results.
//     const gptQuery =
//       "Act as a Movie Recommendation system and suggest some movies for the query : " +
//       searchText.current.value +
//       ". only give me names of 5 movies, comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";

//     try {
//       const completion = await client.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: gptQuery }],
//       });

//       const reply = completion.choices?.[0]?.message?.content.split(",");

//       // For each movie I will search for TMDB API

//       const promiseArray = reply.map((movie) => SearchMovieTMDB(movie)); // map function all immediately it dosen't wait to complete previous search , so it will give promise array in which all the response are pending!

//       const tmdbResults = await Promise.all(promiseArray);
//       console.log(tmdbResults);

//       // if (!reply) {
//       //   alert("No response received");
//       // } else {
//       //   console.log(reply);
//       // }
//       if (!tmdbResults) {
//         const data = await SearchMovieTMDB(searchText.current.value);
//         console.log(data);
//       }
//     } catch (err) {
//       console.log("ChatGPT failed. Try again later.", err);
//     }
//   };
//   return (
//     <div className="pt-[35%] md:pt-[10%] flex justify-center">
//       <form
//         className="w-full md:w-1/2 bg-black grid grid-cols-12"
//         onSubmit={(e) => e.preventDefault()}
//       >
//         <input
//           ref={searchText}
//           type="text"
//           className=" p-4 m-4 col-span-9 text-white"
//           placeholder={lang[langKey].gptSearchPlaceholder}
//         />
//         <button
//           className="col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg"
//           onClick={handleGptSearchClick}
//         >
//           {lang[langKey].search}
//           {/* {lang.hindi.search} */}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default GptSearchBar;


import React, { useRef, useState } from "react";
import lang from "../utils/languageConstant";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import client from "../utils/openai";
import axios from "axios";
import { API_OPTIONS } from "../utils/constants";
import { addGptMovieResults } from "../utils/GptSlice";
const GptSearchBar = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);

  const startCooldown = () => {
    setCooldown(true);
    setTimeout(() => setCooldown(false), 5000); // 5 sec
  };
  const filterExactMovie = (movies, query) => {
    const q = query.toLowerCase().trim();

    return movies.filter((movie) => movie.title?.toLowerCase().trim() === q);
  };

  // Search Movie in TMDB API

  const SearchMovieTMDB = async (movie) => {
    const data = await axios.get(
      "https://api.themoviedb.org/3/search/movie?query=" +
        movie +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS
    );
    const response = data.data.results;
    return response;
  };
  const handleGptSearchClick = async () => {
    const queryText = searchText.current.value?.trim();

    if (!queryText) {
      return toast.info("🦄 Please enter a movie name!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    if (cooldown) {
      alert("Please wait a few seconds before trying again", "warning");
      return;
    }

    setLoading(true);
    startCooldown();

    const gptQuery =
      "Act as a Movie Recommendation system and suggest some movies for the query : " +
      queryText +
      ". only give me names of 5 movies, comma seperated.";

    try {
      // const completion = await client.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: [{ role: "user", content: gptQuery }],
      // });

      const content = completion?.choices?.[0]?.message?.content;

      // ❌ GPT failed → fallback to TMDB
      if (!content) {
        toast.warning("AI failed. Showing TMDB results instead.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        const data = await SearchMovieTMDB(queryText);
        const exactMatches = filterExactMovie(data, queryText);
        dispatch(addGptMovieResults({ lastTmdbMovies: data }));
        console.log("TMDB exact matches:", exactMatches, data);

        setLoading(false);
        return;
      }

      const reply = content.split(",");

      const promiseArray = reply.map((movie) => SearchMovieTMDB(movie.trim()));

      const tmdbResults = await Promise.all(promiseArray);
      dispatch(
        addGptMovieResults({ movieNames: content, movieResults: tmdbResults })
      );

      console.log("GPT + TMDB results:", tmdbResults);

      if (tmdbResults.length === 0) {
        toast.warning("No movies found", "info");
      }
    } catch (err) {
      console.error(err);

      // ❌ GPT crashed → fallback
      toast.warning("AI error. Showing TMDB results instead.", "warning");

      try {
        const data = await SearchMovieTMDB(queryText);
        const exactMatches = filterExactMovie(data, queryText);
        dispatch(addGptMovieResults({ lastTmdbMovies: data }));

        console.log("TMDB Last:", data, exactMatches);
      } catch (tmdbErr) {
        toast.warning("TMDB also failed. Try later.", tmdbErr);
      }
    } finally {
      setLoading(false);
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
          className=" p-4 m-4 col-span-9 text-white"
          placeholder={lang[langKey].gptSearchPlaceholder}
        />
        <button
          className="col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg"
          onClick={handleGptSearchClick}
          disabled={loading || cooldown}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            lang[langKey].search
          )}{" "}
          {/* {lang.hindi.search} */}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
