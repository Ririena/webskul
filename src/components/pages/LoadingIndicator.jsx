"use client";
import React from "react";

const LoadingIndicator = ({ loading, hasMore, sentryRef }) => {
    return (
        <div className="text-center py-4">
            {(loading || hasMore) && (
                <div ref={sentryRef}>
                    {loading ? (
                        <div className="flex items-center justify-center py-4">
                            <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                            <p className="ml-2">Loading more posts...</p>
                        </div>
                    ) : (
                        <p>No more posts to load.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default LoadingIndicator;
