"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MessageCircle, Share, Trash2, Edit3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { getUserByEmail, getUserFromTable } from "@/lib/UserLibs"; // Make sure to import these functions if not already
import { Separator } from "../ui/separator";

const POSTS_PER_PAGE = 1;

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [imageRatios, setImageRatios] = useState({});
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [commentsMap, setCommentsMap] = useState({});
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [imageLoadingMap, setImageLoadingMap] = useState({});

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage: hasMore,
        onLoadMore: () =>
            fetchPosts(Math.ceil(posts.length / POSTS_PER_PAGE) + 1),
        rootMargin: "0px 0px 800px 0px",
        disabled: !!error,
    });

    const handleImageLoadStart = (postId) => {
        setImageLoadingMap((prev) => ({
            ...prev,
            [postId]: true,
        }));
    };

    const handleImageLoadEnd = (postId, width, height) => {
        const ratio = width / height;
        setImageRatios((prevRatios) => ({
            ...prevRatios,
            [postId]: ratio,
        }));
        setImageLoadingMap((prev) => ({
            ...prev,
            [postId]: false,
        }));
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await getUserByEmail();
                if (user) {
                    const userDataFromTable = await getUserFromTable(
                        user.email
                    );
                    if (userDataFromTable) {
                        setCurrentUser(userDataFromTable.id); // Ensure currentUser is set correctly
                    }
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
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
                .select(
                    `
                    *,
                    user: user_id (
                        username,
                        profile_picture_url
                    )
                `
                )
                .order("created_at", { ascending: false })
                .range(
                    (pageNumber - 1) * POSTS_PER_PAGE,
                    pageNumber * POSTS_PER_PAGE - 1
                );

            if (error) throw error;

            if (data.length < POSTS_PER_PAGE) {
                setHasMore(false);
            }

            setTimeout(() => {
                setPosts((prevPosts) => [...prevPosts, ...data]);
                setLoading(false);
            }, 500); // Set delay to 500ms
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

            setPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== postId)
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteComment = async (commentId, postId) => {
        try {
            const { error } = await supabase
                .from("comments")
                .delete()
                .eq("id", commentId);

            if (error) throw error;

            setCommentsMap((prevCommentsMap) => {
                const updatedComments = prevCommentsMap[postId].filter(
                    (comment) => comment.id !== commentId
                );
                return {
                    ...prevCommentsMap,
                    [postId]: updatedComments,
                };
            });
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };

    const editComment = (comment) => {
        setEditingCommentId(comment.id);
        setValue("comment", comment.content);
    };

    const onSubmit = async (data) => {
        try {
            if (!currentUser) {
                throw new Error("User must be logged in to comment.");
            }

            if (editingCommentId) {
                const { error } = await supabase
                    .from("comments")
                    .update({ content: data.comment })
                    .eq("id", editingCommentId);

                if (error) throw error;

                setCommentsMap((prevCommentsMap) => {
                    const updatedComments = prevCommentsMap[selectedPostId].map(
                        (comment) =>
                            comment.id === editingCommentId
                                ? { ...comment, content: data.comment }
                                : comment
                    );
                    return {
                        ...prevCommentsMap,
                        [selectedPostId]: updatedComments,
                    };
                });

                setEditingCommentId(null);
            } else {
                const { error } = await supabase.from("comments").insert({
                    content: data.comment,
                    post_id: selectedPostId,
                    user_id: currentUser, // Ensure currentUser is passed here
                });

                if (error) throw error;

                const updatedComments = await fetchCommentsForPosts([
                    selectedPostId,
                ]);
                setCommentsMap((prevCommentsMap) => ({
                    ...prevCommentsMap,
                    ...updatedComments,
                }));
            }

            reset();
        } catch (error) {
            console.error("Failed to submit comment", error);
        }
    };

    const fetchCommentsForPosts = async (postIds) => {
        const { data: comments, error } = await supabase
            .from("comments")
            .select("id, content, user_id, post_id")
            .in("post_id", postIds);

        if (error) {
            console.error("Failed to fetch comments", error);
            return {};
        }

        const commentsByPost = comments.reduce((acc, comment) => {
            if (!acc[comment.post_id]) {
                acc[comment.post_id] = [];
            }
            acc[comment.post_id].push(comment);
            return acc;
        }, {});

        for (const postId in commentsByPost) {
            const enrichedComments = await Promise.all(
                commentsByPost[postId].map(async (comment) => {
                    const { data: user, error: userError } = await supabase
                        .from("user")
                        .select("username, profile_picture_url")
                        .eq("id", comment.user_id)
                        .single();

                    if (userError) {
                        console.error("Failed to fetch user data", userError);
                    }

                    return {
                        ...comment,
                        username: user?.username,
                        profile_picture_url: user?.profile_picture_url,
                    };
                })
            );
            commentsByPost[postId] = enrichedComments;
        }

        return commentsByPost;
    };

    useEffect(() => {
        if (posts.length > 0) {
            const postIds = posts.map((post) => post.id);
            fetchCommentsForPosts(postIds).then((comments) => {
                setCommentsMap((prevCommentsMap) => ({
                    ...prevCommentsMap,
                    ...comments,
                }));
            });
        }
    }, [posts]);

    return (
        <>
            <main className="bg-background dark:bg-background">
                {posts.map((post) => (
                    <div key={post.id}>
                        <Card
                            onClick={() => {
                                setIsOpen(true);
                                setSelectedPostId(post.id);
                            }}
                            className="w-[450px] rounded-lg shadow-lg cursor-pointer mb-4"
                        >
                            <CardContent>
                                <div className="flex flex-col items-center mt-6">
                                    <Avatar className="mb-4">
                                        <AvatarImage
                                            src={
                                                post.user.profile_picture_url ||
                                                "/placeholder-user.jpg"
                                            }
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-md font-semibold">
                                        {post.user.username || "Unknown User"}
                                    </h3>
                                    <h5 className="text-sm text-gray-500">
                                        {new Date(
                                            post.created_at
                                        ).toLocaleDateString()}
                                    </h5>
                                </div>
                                <div className="mt-4">
                                    <Image
                                        src={
                                            post.image_url ||
                                            "/placeholder-image.jpg"
                                        }
                                        alt="Post Image"
                                        height={500}
                                        width={500}
                                        className="rounded-md object-cover w-full h-auto"
                                        layout="responsive"
                                    />
                                </div>
                                <div className="px-4 py-2">
                                    <h4 className="text-lg font-bold mt-4">
                                        {post.title || "Untitled Post"}
                                    </h4>
                                </div>
                                <Separator />
                                <div className="flex justify-end px-4 py-2 space-x-4">
                                    <MessageCircle className="text-gray-500 hover:text-primary cursor-pointer" />
                                    <Share className="text-gray-500 hover:text-primary cursor-pointer" />
                                </div>
                            </CardContent>
                        </Card>

                        {isOpen && selectedPostId === post.id && (
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogContent className="sm:max-w-[800px] max-w-[90vw] max-h-[90vh] overflow-auto grid md:grid-cols-2 gap-4">
                                    <div className="flex flex-col items-start justify-start gap-4 py-8">
                                        <Image
                                            src={
                                                post.image_url ||
                                                "/placeholder-image.jpg"
                                            }
                                            width={800}
                                            height={600}
                                            alt="Post image"
                                            className="object-cover  rounded-lg w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start justify-start gap-4 py-8">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold">
                                                {post.title || "Untitled Post"}
                                            </h2>
                                            <div className="flex items-center gap-4">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={
                                                            post.user
                                                                .profile_picture_url ||
                                                            "/placeholder-user.jpg"
                                                        }
                                                        alt={
                                                            post.user
                                                                .username ||
                                                            "Unknown User"
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        CN
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="grid gap-1">
                                                    <div className="font-medium">
                                                        {post.user.username ||
                                                            "Unknown User"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(
                                                            post.created_at
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <p>
                                                {post.content ||
                                                    "No description available for this post."}
                                            </p>
                                        </div>

                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold">
                                                Comments:
                                            </h3>
                                            <ul className="space-y-2">
                                                {(
                                                    commentsMap[post.id] || []
                                                ).map((comment) => (
                                                    <li
                                                        key={comment.id}
                                                        className="flex items-center space-x-4"
                                                    >
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={
                                                                    comment.profile_picture_url ||
                                                                    "/placeholder-user.jpg"
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                CN
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-semibold">
                                                                {
                                                                    comment.username
                                                                }
                                                            </p>
                                                            <p>
                                                                {
                                                                    comment.content
                                                                }
                                                            </p>
                                                            {comment.user_id ===
                                                                currentUser && (
                                                                <div className="flex space-x-2 mt-1">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            setEditingCommentId(
                                                                                comment.id
                                                                            );
                                                                            setValue(
                                                                                "comment",
                                                                                comment.content
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Edit3 className="mr-1" />
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() =>
                                                                            deleteComment(
                                                                                comment.id,
                                                                                post.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="mr-1" />
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <form
                                            onSubmit={handleSubmit(onSubmit)}
                                            className="space-y-4 mt-4 w-full"
                                        >
                                            <div className="w-full">
                                                <input
                                                    type="text"
                                                    {...register("comment", {
                                                        required: true,
                                                    })}
                                                    placeholder="Add a comment..."
                                                    className="border p-2 w-full rounded"
                                                />
                                            </div>
                                            {errors.comment && (
                                                <p className="text-red-500">
                                                    Comment is required.
                                                </p>
                                            )}
                                            <Button
                                                type="submit"
                                                className="w-full"
                                            >
                                                {editingCommentId
                                                    ? "Update Comment"
                                                    : "Submit"}
                                            </Button>
                                        </form>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                ))}
                <div className="text-center py-4">
                    {(loading || hasMore) && (
                        <div ref={sentryRef}>
                            {loading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                                    <p className="ml-2">
                                        Loading more posts...
                                    </p>
                                </div>
                            ) : (
                                <p>No more posts to load.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
