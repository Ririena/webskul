// components/SkeletonCard.js
import { Skeleton } from "@/components/ui/skeleton"; // Adjust the import path as necessary

const SkeletonCard = () => {
  return (
    <div className="relative p-6 shadow-xl rounded-lg overflow-hidden text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-800">
      <div className="absolute top-0 left-0 w-full h-32 bg-gray-300 dark:bg-gray-700"></div>
      <div className="relative mx-auto w-32 h-32 mt-4 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700"></div>
      <div className="relative text-center mt-20">
        <Skeleton className="font-semibold text-lg mb-2 bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="text-gray-500 dark:text-gray-400 bg-gray-300 dark:bg-gray-700" />
      </div>
      <div className="relative text-center mt-4">
        <Skeleton className="text-sm text-gray-500 dark:text-gray-400 mb-4 bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="text-sm bg-gray-300 dark:bg-gray-700" />
      </div>
      <div className="relative flex justify-center mt-4">
        <Skeleton className="w-32 h-8 bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
};

export default SkeletonCard;
