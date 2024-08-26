"use client";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Image from "next/image";

const CommentSection = ({ comments, onSubmit, errors, register, handleSubmit }) => {
    return (
        <div>
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
            <div className="mt-4">
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
                        <p className="text-red-500 mt-1 text-center">Comment is required.</p>
                    )}
                    <div className="flex justify-center space-x-2">
                        <Button type="submit" className="max-w-lg w-full">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentSection;
