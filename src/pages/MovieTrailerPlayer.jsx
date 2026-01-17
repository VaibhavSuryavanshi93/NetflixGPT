import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_OPTIONS, IMG_CDN_URL } from "../utils/constants";

const MovieTrailerPlayer = () => {
  const { movieId } = useParams(); // ✅ FIX
  const navigate = useNavigate();

  const [trailerKey, setTrailerKey] = useState(null);
  const [posterPath, setPosterPath] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTrailer = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos`,
        API_OPTIONS
      );

      const trailer = res.data.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      if (trailer) setTrailerKey(trailer.key);
    } catch (err) {
      console.error("Trailer fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ESC to close
  const handleEsc = useCallback(
    (e) => {
      if (e.key === "Escape") navigate(-1);
    },
    [navigate]
  );

  useEffect(() => {
    if (!movieId) return;
    fetchTrailer();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [movieId]);

  // Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-5xl aspect-video shimmer rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-10 text-white bg-black/70 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <div className="w-full max-w-5xl">
        {trailerKey ? (
          <iframe
            className="w-full aspect-video rounded-xl"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&playsinline=1`}
            allow="autoplay; encrypted-media; fullscreen,accelerometer"
            allowFullScreen
            title="Trailer"
          />
        ) : (
          <div className="w-full aspect-video bg-black flex items-center justify-center text-white">
            Trailer not available
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieTrailerPlayer;
