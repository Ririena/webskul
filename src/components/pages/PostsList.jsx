"use client";
import React, { useEffect, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getUserFromTable, getUserByEmail } from "@/lib/UserLibs";
import { Trash2, Edit3 } from 'lucide-react';
import { Separator } from "../ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MessageCircle } from "lucide-react";

const POSTS_PER_PAGE = 1;

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [imageRatios, setImageRatios] = useState({});
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [commentsMap, setCommentsMap] = useState({});
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [imageLoadingMap, setImageLoadingMap] = useState({}); // New state to track image loading status

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

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await getUserByEmail();
                const userDataFromTable = await getUserFromTable(user.email);
                setCurrentUser(userDataFromTable.id);
            } catch (error) {
                return;
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
                const { error } = await supabase
                    .from("comments")
                    .insert({
                        content: data.comment,
                        post_id: selectedPostId,
                        user_id: currentUser,
                    });

                if (error) throw error;

                const updatedComments = await fetchCommentsForPosts([selectedPostId]);
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
        <div className="w-full sm:w-1/2 p-4">
            {error && <p className="text-red-500">{error}</p>}
            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                posts.map((post) => {
                    const aspectRatio = imageRatios[post.id] || 16 / 9;
                    const comments = commentsMap[post.id] || [];
                    const isImageLoading = imageLoadingMap[post.id]; // Check if image is loading

                    return (
                        <Card key={post.id} className="mb-4">
                            <CardHeader>
                                <CardTitle>
                                    {post.content || "Untitled Post"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {post.image_url && (
                                    <AspectRatio
                                        ratio={aspectRatio}
                                        className="relative bg-muted"
                                    >
                                        {isImageLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-md">
                                                <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                        <Image
                                            src={post.image_url}
                                            alt="Post Image"
                                            fill
                                            className={`rounded-md object-cover ${isImageLoading ? 'invisible' : 'visible'}`}
                                            onLoadStart={() => handleImageLoadStart(post.id)}
                                            onLoad={(e) =>
                                                handleImageLoadEnd(
                                                    post.id,
                                                    e.target.naturalWidth,
                                                    e.target.naturalHeight
                                                )
                                            }
                                        />
                                    </AspectRatio>
                                )}
                                <Separator />
                                <div className="grid grid-cols-2 gap-32">
                                    <Sheet>
                                        <SheetTrigger>
                                            <Button
                                                className="mt-4 w-full"
                                                variant="outline"
                                                onClick={() => setSelectedPostId(post.id)}
                                            >
                                                Komen
                                                <span className="ml-1">
                                                    <MessageCircle />
                                                </span>
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent
                                            side="bottom"
                                            className="flex justify-center items-center"
                                        >
                                            <div className="w-full max-w-md p-4">
                                                <SheetHeader>
                                                    <SheetTitle className="text-center">
                                                        {editingCommentId
                                                            ? "Edit Comment"
                                                            : "Add a Comment"}
                                                    </SheetTitle>
                                                </SheetHeader>
                                                <div className="p-4">
                                                    <form
                                                        onSubmit={handleSubmit(onSubmit)}
                                                        className="space-y-4"
                                                    >
                                                        <div className="w-full flex justify-center">
                                                            <Input
                                                                type="text"
                                                                {...register(
                                                                    "comment",
                                                                    { required: true }
                                                                )}
                                                                placeholder="Add a comment..."
                                                                className="border p-2 w-full rounded"
                                                            />
                                                        </div>
                                                        {errors.comment && (
                                                            <p className="text-red-500 mt-1 text-center">
                                                                Comment is required.
                                                            </p>
                                                        )}
                                                        <div className="flex justify-center space-x-2">
                                                            <Button
                                                                type="submit"
                                                                className="max-w-lg w-full"
                                                            >
                                                                {editingCommentId
                                                                    ? "Update Comment"
                                                                    : "Submit"}
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </SheetContent>
                                    </Sheet>

                                    {currentUser && (
                                        <Sheet>
                                            <SheetTrigger>
                                                <Button
                                                    className="mt-4 w-full"
                                                    variant="outline"
                                                >
                                                    Delete <span className="ml-1">
                                                        <Trash2/>
                                                    </span>
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent side="bottom">
                                                <SheetHeader>
                                                    <SheetTitle className="text-center">
                                                        Confirm Deletion
                                                    </SheetTitle>
                                                </SheetHeader>
                                                <div className="p-4 flex justify-center items-center">
                                                    <Button
                                                        onClick={() => deletePost(post.id)}
                                                        className="max-w-lg w-full"
                                                        variant="destructive"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </SheetContent>
                                        </Sheet>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">Comments:</h3>
                                    <Separator />
                                    <ul className="space-y-2">
                                        {comments.map((comment) => (
                                            <li key={comment.id} className="flex items-center space-x-4">
                                                <Image
                                                    src={comment.profile_picture_url}
                                                    alt="Profile Picture"
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                />
                                                <div>
                                                    <p className="font-semibold">
                                                        {comment.username}
                                                    </p>
                                                    <p>{comment.content}</p>
                                                    {comment.user_id === currentUser && (
                                                        <div className="flex space-x-2 mt-1">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => editComment(comment)}
                                                            >
                                                                <Edit3 className="mr-1" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    deleteComment(comment.id, post.id)
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
