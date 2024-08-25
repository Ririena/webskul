"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import Image from "next/image";
export default function MyProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("text");

  const handleEditProfile = () => {
    router.push("/edit-profile"); // Redirect to the EditProfile page
  };

  const handleRedirect = (path) => {
    router.push(path); // Redirect to the specified path
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg pb-24">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        {/* Profile Picture */}
        <div className="flex-shrink-0 mb-4 md:mb-0 text-center md:text-left">
          <Image
            src="/profile-picture.jpg" // Replace with actual profile image
            alt="Profile"
            width={128}
            height={128}
            className=" rounded-full border mx-auto md:mx-0"
          />
        </div>

        {/* Profile Information */}
        <div className="text-center md:text-left md:ml-6 flex-1">
          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            John Doe
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            johndoe@example.com
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            A passionate developer who loves building modern web apps.
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={handleEditProfile}
            className="mt-4"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Tabs for switching between Text and Image posts */}
      <div className="mb-4">
        <div className="flex border-b border-gray-200 dark:border-neutral-700">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "text"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("text")}
          >
            Text
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === "image"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("image")}
          >
            Image
          </button>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Posts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {activeTab === "text" &&
            // Example Text Posts
            [1, 2, 3, 4, 5, 6, 7].map((item) => (
              <Card
                key={item}
                className="bg-gray-100 dark:bg-neutral-800 rounded-lg shadow-md cursor-pointer"
                onClick={() => handleRedirect(`/post/${item}`)} // Redirect on card click
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Post Title {item}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    This is a description of post {item}.
                  </p>
                </CardContent>
              </Card>
            ))}

          {activeTab === "image" &&
            // Example Image Posts
            [1, 2, 3, 4, 5, 6].map((item) => (
              <Card
                key={item}
                className="bg-gray-100 dark:bg-neutral-800 rounded-lg shadow-md cursor-pointer"
                onClick={() => handleRedirect(`/post/${item}`)} // Redirect on card click
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Post Title {item}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={`/post-image-${item}.jpg`} // Replace with actual post image
                    alt={`Post ${item}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
