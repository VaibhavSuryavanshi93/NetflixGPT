import { Link } from "react-router-dom";
import { IMG_CDN_URL } from "../utils/constants";

const MovieCard = ({ posterPath, id }) => {
  if (!posterPath) return null;

  return (
    <div className="w-36 md:w-48 pr-4 cursor-pointer hover:scale-105 transition">
      <Link to={"/browse/" + id}>
        <img
          className="rounded-xl"
          src={IMG_CDN_URL + posterPath}
          alt="movie poster"
        />
      </Link>
    </div>
  );
};

export default MovieCard;
