import Skeleton from "react-loading-skeleton";

const MovieListSkeleton = () => {
  return (
    <div className="px-6 py-4">
      <div className="h-6 w-40 shimmer rounded mb-4" />

      <div className="flex gap-4 overflow-hidden">
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="w-[150px] h-[225px] rounded shimmer flex-shrink-0"
            />
          ))}
      </div>
    </div>
  );
};

export default MovieListSkeleton;
