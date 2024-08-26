// components/PostWithImage.js
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MessageCircle, Trash2 } from 'lucide-react';

const PostWithImage = ({ post, comments, imageRatios, handleImageLoad, onSubmit, errors, register, handleSubmit, reset, deletePost, currentUser }) => {
    const aspectRatio = imageRatios[post.id] || 16 / 9;

    return (
        <Card key={post.id} className="mb-4">
            <CardHeader>
                <CardTitle>{post.content || "Untitled Post"}</CardTitle>
            </CardHeader>
            <CardContent>
                <AspectRatio ratio={aspectRatio} className="relative bg-muted">
                    <Image
                        src={post.image_url}
                        alt="Post Image"
                        fill
                        className="rounded-md object-cover"
                        onLoad={(e) => handleImageLoad(post.id, e.target.naturalWidth, e.target.naturalHeight)}
                    />
                </AspectRatio>
                <Separator />
                <div className="grid grid-cols-2 gap-32">
                    <Sheet>
                        <SheetTrigger>
                            <Button className="mt-4 w-full" variant="outline">
                                Komen
                                <span className="ml-1">
                                    <MessageCircle />
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="flex justify-center items-center">
                            <div className="w-full max-w-md p-4">
                                <SheetHeader>
                                    <SheetTitle className="text-center">
                                        Add a Comment
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="p-4">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="w-full flex justify-center">
                                            <Input
                                                type="text"
                                                {...register("comment", { required: true })}
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
                                            <Button type="submit" className="max-w-lg w-full">
                                                Submit
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
                                <Button className="mt-4 w-full" variant="outline">
                                    Delete
                                    <span className="ml-1">
                                        <Trash2 />
                                    </span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom">
                                <SheetHeader>
                                    <SheetTitle className="text-center">
                                        Confirm Deletion
                                    </SheetTitle>
                                    <SheetDescription className="text-center">
                                        Are you sure you want to delete this post?
                                    </SheetDescription>
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
                    {/* Comments Section */}
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
                                    <p className="font-semibold">{comment.username}</p>
                                    <p>{comment.content}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export default PostWithImage;
