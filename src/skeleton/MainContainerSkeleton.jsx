import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MainContainerSkeleton = () => {
  return (
    <div className="relative bg-black h-[60vh] md:h-[90vh] overflow-hidden">

      {/* Video backdrop skeleton */}
      <div className="absolute inset-0 shimmer opacity-60" />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 px-6 pt-[30%] md:pt-[18%] max-w-2xl">

        {/* Title */}
        <div className="h-10 w-3/4 md:w-2/3 rounded shimmer mb-4" />

        {/* Description */}
        <div className="h-4 w-full rounded shimmer mb-2" />
        <div className="h-4 w-5/6 rounded shimmer mb-6" />

        {/* Buttons */}
        <div className="flex gap-4">
          <div className="h-10 w-28 rounded shimmer" />
          <div className="h-10 w-36 rounded shimmer" />
        </div>
      </div>
    </div>
  );
};


export default MainContainerSkeleton;
