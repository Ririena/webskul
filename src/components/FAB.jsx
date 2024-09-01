"use client";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { getUserByEmail, getUserFromTable } from "@/lib/UserLibs";
import { v4 as uuidv4 } from "uuid";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

const Fab = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { handleSubmit, control, setValue } = useForm();
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // To store the image preview
    const [userError, setUserError] = useState("");

    const onSubmit = async (data) => {
        try {
            const user = await getUserByEmail();
            if (userError) throw userError;

            const userDataFromTable = await getUserFromTable(user.email);
            if (!userDataFromTable || !userDataFromTable.id) {
                throw new Error("User not found in the table");
            }

            let imageName = null;
            let imageUrl = null;
            if (file) {
                imageName = `${uuidv4()}.${file.name.split(".").pop()}`;

                const { data: fileData, error: fileError } =
                    await supabase.storage
                        .from("images")
                        .upload(`postingan/${imageName}`, file);

                if (fileError) {
                    console.error("Error uploading file:", fileError.message);
                    return;
                }

                imageUrl = `https://rujhylbasedavctyitpz.supabase.co/storage/v1/object/public/images/postingan/${imageName}`;
            }

            const { error: postError } = await supabase.from("posts").insert([
                {
                    title: data.title,
                    content: data.content,
                    image_url: imageUrl,
                    user_id: userDataFromTable.id,
                },
            ]);

            if (postError) {
                console.error({ postError: postError.message });
            } else {
                console.log("Post created successfully");
                // Reset form and close modal
                setIsOpen(false);
                setImagePreview(null);
                setFile(null);
                setValue("content", ""); // Reset the textarea content
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set the image preview to the result of FileReader
            };
            reader.readAsDataURL(file); // Read the image file as a data URL
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary rounded-full p-4 shadow-lg hover:bg-primary-dark transition-all"
                    aria-label="Create new post"
                >
                    <Plus size={24} />
                </Button>
            </div>

            {/* Modal for Creating Post */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md mx-auto">
                    <h3 className="text-xl font-semibold mb-4">
                        Create New Post
                    </h3>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                {...control.register("title", {
                                    required: true,
                                })}
                                placeholder="Enter post title"
                                className="w-full p-2 border rounded"
                            />

                            <Label htmlFor="content">Description</Label>
                            <Controller
                                name="content"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        id="content"
                                        placeholder="What's on your mind?"
                                        className="w-full p-2 border rounded"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex items-center gap-2"
                            >
                                <ImageIcon />
                                Upload Image
                            </label>
                            <Input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>

                        {imagePreview && (
                            <div className="mt-4">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-auto rounded-md"
                                />
                                <p className="text-sm mt-2">Image preview</p>
                            </div>
                        )}

                        <Button type="submit" className="bg-primary w-full">
                            Submit
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Fab;
