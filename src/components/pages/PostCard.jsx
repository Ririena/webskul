import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Separator } from "../ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import CommentSection from "./CommentSection";

const PostCard = ({
    post,
    imageRatios,
    handleImageLoad,
    comments,
    onSubmit,
    errors,
    register,
    handleSubmit,
    currentUser,
    deletePost,
}) => {
    const aspectRatio = imageRatios[post.id] || 16 / 9;

    return (
        <div className="w-full sm:w-1/2 p-4">
            <Card key={post.id} className="mb-4">
                <CardHeader>
                    <CardTitle>{post.content || "Untitled Post"}</CardTitle>
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
                    <Separator />
                    <div className="grid grid-cols-2 gap-32">
                        <Sheet>
                            <SheetTrigger>
                                <Button
                                    className="mt-4 w-full"
                                    variant="outline"
                                >
                                    Komen
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="bottom"
                                className="flex justify-center items-center"
                            >
                                <div className="w-full max-w-md p-4">
                                    <SheetHeader>
                                        <SheetTitle className="text-center">
                                            Add a Comment
                                        </SheetTitle>
                                    </SheetHeader>
                                    <CommentSection
                                        onSubmit={onSubmit}
                                        errors={errors}
                                        register={register}
                                        handleSubmit={handleSubmit} // Ensure handleSubmit is passed here
                                    />
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
                                        Delete
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
                        <CommentSection
                            comments={comments}
                            onSubmit={onSubmit}
                            errors={errors}
                            register={register}
                            handleSubmit={handleSubmit} // Ensure handleSubmit is passed here
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PostCard;
