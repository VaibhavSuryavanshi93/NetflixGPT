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

import React, { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, SUPPORTED_LANGUAGES } from "../utils/constants";
import { toggleGptSearchView } from "../utils/GptSlice";
import { changeLanguage } from "../utils/configSlice";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SearchIcon from "@mui/icons-material/Search";
const Navbar = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        navigate("/error");
        error;
      });
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        navigate("/browse");
        // ...
      } else {
        dispatch(removeUser());
        navigate("/");
        // User is signed out
        // ...
      }
    });
    // Unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };
  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };
  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex  md:flex-row justify-between">
      <Link to="/browse">
        <img className="w-44 mt-2 md:mt-0 -ml-6 md:mx-0" src={LOGO} alt="logo" />
      </Link>
      {user && (
        <div className="flex p-2 justify-between">
          {showGptSearch && (
            <select
              className="p-2 m-2 bg-black/40 text-white border-t-indigo-600 rounded-lg  cursor-pointer hover:text-blue-400"
              onChange={handleLanguageChange}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.identifier} value={lang.identifier}>
                  {lang.name}
                </option>
              ))}
            </select>
          )}
          <button
            className="py-2 px-4 mx-4 my-2  border-t-indigo-600 text-white rounded-lg  hover:bg-gray-200/10 cursor-pointer hover:text-yellow-400  "
            onClick={handleGptSearchClick}
          >
            {showGptSearch ? (
              ""
            ) : (
              <SearchOutlinedIcon
                style={{ fontSize: "28px", marginRight: "8px" }}
              />
            )}

            {showGptSearch ? "Homepage" :"Search"}
          </button>
          <img
            className="hidden md:block w-12 h-12"
            alt="usericon"
            src={user?.photoURL}
          />
          <button onClick={handleSignOut} className="font-bold text-white ">
            (Sign Out)
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;

how to align logo and search button same as given photo 