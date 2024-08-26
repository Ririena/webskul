"use client";
import React, { useEffect, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getUserFromTable, getUserByEmail } from "@/lib/UserLibs";
const POSTS_PER_PAGE = 1; // Adjust this value as needed

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [imageRatios, setImageRatios] = useState({});
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [userError, setUserError] = useState("");
    const [idUserPost, setIdUserPost] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Fetch current user on component mount
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await getUserByEmail();

                const userDataFromTable = await getUserFromTable(user.email);

                setCurrentUser(userDataFromTable.id);
                console.log(userDataFromTable.id);
            } catch (error) {
                console.log("");
            }
        };
        fetchCurrentUser();
    }, []);

    const fetchPosts = async (pageNumber) => {
        if (loading) return;
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .order("created_at", { ascending: false })
                .range(
                    (pageNumber - 1) * POSTS_PER_PAGE,
                    pageNumber * POSTS_PER_PAGE - 1
                );

            if (error) {
                throw error;
            }

            if (data.length < POSTS_PER_PAGE) {
                setHasMore(false); // No more posts to load
            }

            // Simulate a delay in updating the posts state
            setTimeout(() => {
                setPosts((prevPosts) => [...prevPosts, ...data]);
                setLoading(false);
            }, 500); // Adjust delay time as needed (in milliseconds)
            setIdUserPost(data);
            console.log({ data });
            console.log(data.user_id + "testst");
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const deletePost = async (postId) => {
        if (!currentUser) return;

        try {
            const { data: post, error: postError } = await supabase
                .from("posts")
                .select("user_id")
                .eq("id", postId)
                .single();

            if (postError) throw postError;

            if (post.user_id !== currentUser) {
                throw new Error("You are not authorized to delete this post.");
            }

            const { error: deleteError } = await supabase
                .from("posts")
                .delete()
                .eq("id", postId);

            if (deleteError) throw deleteError;

            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
            setError(error.message);
        }
    };

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage: hasMore,
        onLoadMore: () =>
            fetchPosts(Math.ceil(posts.length / POSTS_PER_PAGE) + 1),
        rootMargin: "0px 0px 800px 0px", // Increased bottom margin for earlier trigger
        disabled: !!error,
    });

    const handleImageLoad = (id, width, height) => {
        const ratio = width / height;
        setImageRatios((prevRatios) => ({
            ...prevRatios,
            [id]: ratio,
        }));
    };

    return (
        <div className="w-full sm:w-1/2 p-4">
            {error && <p className="text-red-500">{error}</p>}
            {userError && <p className="text-red-500">{userError}</p>}
            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                posts.map((post) => {
                    const aspectRatio = imageRatios[post.id] || 16 / 9;

                    return (
                        <Card key={post.id} className="mb-4">
                            <CardHeader>
                                <CardTitle>
                                    {post.content || "Untitled Post"}
                                </CardTitle>
                                {currentUser && (
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        className="text-red-500 hover:text-red-700 mt-2"
                                    >
                                        Delete Post
                                    </button>
                                )}
                            </CardHeader>
                            <CardContent>
                                {post.image_url && (
                                    <AspectRatio
                                        ratio={aspectRatio}
                                        className="relative bg-muted"
                                    >
                                        <Image
                                            src={post.image_url}
                                            alt="Post Image"
                                            fill
                                            className="rounded-md object-cover"
                                            onLoad={(e) =>
                                                handleImageLoad(
                                                    post.id,
                                                    e.target.naturalWidth,
                                                    e.target.naturalHeight
                                                )
                                            }
                                        />
                                    </AspectRatio>
                                )}
                                <p>{post.content}</p>
                                <div className="mt-4">
                                    {/* Static Comments Section */}
                                    <h3 className="text-lg font-semibold">
                                        Comments:
                                    </h3>
                                    <ul>
                                        <li className="py-1">Great post!</li>
                                        <li className="py-1">
                                            Very informative.
                                        </li>
                                        <li className="py-1">
                                            Thanks for sharing.
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })
            )}
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
        </div>
    );
};

export default PostsList;
