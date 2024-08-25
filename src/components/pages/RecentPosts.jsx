// components/RecentPosts.js
"use client";

import React, { useState } from "react";

const RecentPosts = () => {
    const [activeTab, setActiveTab] = useState("text");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <div className="flex border-b ">
                <button
                    className={`flex-1 py-2 text-center ${activeTab === "text" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
                    onClick={() => handleTabClick("text")}
                >
                    Text Posts
                </button>
                <button
                    className={`flex-1 py-2 text-center ${activeTab === "image" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
                    onClick={() => handleTabClick("image")}
                >
                    Image Posts
                </button>
            </div>
            <div className="mt-4">
                {activeTab === "text" ? (
                    <div>
                        <h3 className="text-lg font-bold mb-2">Recent Text Posts</h3>
                        <div className="space-y-4">
                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                                <h4 className="text-md font-semibold">Text Post Title</h4>
                                <p className="">This is an example of a recent text post.</p>
                            </div>
                            {/* Add more text posts here */}
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-lg font-bold mb-2">Recent Image Posts</h3>
                        <div className="space-y-4">
                            <div className="relative w-full h-60 bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                    src="/example-image.jpg"
                                    alt="Example Image Post"
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                                    <p className="text-white">Image Post Description</p>
                                </div>
                            </div>
                            {/* Add more image posts here */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentPosts;
