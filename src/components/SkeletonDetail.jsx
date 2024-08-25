// components/SkeletonDetail.jsx
import React from 'react';
import { Skeleton } from './ui/skeleton'; // Adjust the import path based on your project structure

export default function SkeletonDetail() {
  return (
    <div className="mx-auto container p-6 space-y-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile image column */}
        <div className="col-span-1">
          <div className="relative bg-gray-200 dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden">
            <Skeleton className="w-full h-40" />
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
              <Skeleton className="w-3/4 h-6" />
            </div>
          </div>
          <div className="mt-4 bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <Skeleton className="h-4 mb-2" />
            <Skeleton className="h-4 mb-2" />
            <Skeleton className="h-4" />
          </div>
        </div>

        {/* Profile details column */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <Skeleton className="h-4 mb-2" />
            <Skeleton className="h-4 mb-2" />
            <Skeleton className="h-4" />
          </div>
        </div>

        {/* Additional information or actions column */}
        <div className="col-span-1">
          <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <Skeleton className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
