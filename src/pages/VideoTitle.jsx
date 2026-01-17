import { useState } from "react";

const StarRating = ({ rating }) => {
  const stars = Math.round(rating / 2); // 10 → 5 scale

  return (
    <div className="flex items-center gap-1 text-yellow-400 text-xl">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <span key={i}>{i < stars ? "★" : "☆"}</span>
        ))}
      <span className="ml-2 text-white text-sm">({rating}/10)</span>
    </div>
  );
};

const VideoTitle = ({ title, overview, rating, releaseDate }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="w-screen aspect-video pt-[20%] px-6 md:px-24 absolute text-white bg-gradient-to-r from-black">
      <h1 className="text-2xl md:text-6xl font-bold">{title}</h1>

      <p className="text-lg mb-4 hidden md:inline-block md:w-[50%]">
        {overview}
      </p>

      {/* Buttons */}
      <div className="my-4 flex items-center gap-3">
        <button className="bg-white text-black py-1 md:py-4 px-3 md:px-12 text-xl rounded-lg hover:bg-white/80">
          ▶️ Play
        </button>

        <button
          onClick={() => setShowInfo((prev) => !prev)}
          className="hidden md:inline-block bg-gray-500/50 text-white p-4 px-12 text-xl rounded-lg"
        >
          {showInfo ? "Hide Info" : "More Info"}
        </button>
      </div>

      {/* Sliding Info Panel */}
      <div
        className={`
          transition-all duration-500 ease-out overflow-hidden
          ${
            showInfo
              ? "max-h-40 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-3"
          }
        `}
      >
        <div className="bg-black/60 p-4 rounded-lg md:w-[50%] mt-1">
          <StarRating rating={rating} />

          <p className="text-md mt-1">
            📅 Release Date:{" "}
            <span className="font-semibold">{releaseDate}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoTitle;
