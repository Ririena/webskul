"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Sidebar = () => {
    const [userPosts, setUserPosts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserPostCounts = async () => {
            try {
                // Fetch user IDs and their post counts
                const { data, error } = await supabase
                    .from("posts")
                    .select("user_id, user:user(*)")
                    .order("user_id", { ascending: true });

                if (error) {
                    setError(error.message);
                    console.error("Error fetching user post counts:", error.message);
                    return;
                }

                // Aggregate post counts by user
                const userMap = data.reduce((acc, post) => {
                    const userId = post.user_id;
                    if (!acc[userId]) {
                        acc[userId] = {
                            user: post.user,
                            postCount: 0,
                        };
                    }
                    acc[userId].postCount += 1;
                    return acc;
                }, {});

                setUserPosts(Object.values(userMap));
            } catch (error) {
                setError(error.message);
                console.error("Error:", error.message);
            }
        };

        fetchUserPostCounts();
    }, []);

    return (
        <aside className="w-64 bg-gray-100 p-4">
            <h2 className="text-xl font-semibold">User Post Counts</h2>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="mt-4">
                {userPosts.map((user) => (
                    <li key={user.user.id} className="mb-2">
                        <p className="font-semibold">{user.user.username || "Unknown User"}</p>
                        <p className="text-gray-700">Posts: {user.postCount}</p>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;
