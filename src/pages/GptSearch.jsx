import React from "react";
import GptSearchBar from "./gptSearchBar";
import GptMovieSuggestion from "./GptMovieSuggestion";
import { BG_URL } from "../utils/constants";
import Footer from "./Footer";

const GptSearch = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img className="h-full w-full object-cover" src={BG_URL} />
      </div>

      {/* Content */}
      <GptSearchBar />
      <GptMovieSuggestion />

      {/* Footer */}
      <div className="bottom-0 w-full mt-120">
        <Footer /> {/* your footer component */}
      </div>
    </div>
  );
};


export default GptSearch;
