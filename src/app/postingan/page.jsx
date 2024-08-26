'use client';
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RecentPosts from "@/components/pages/RecentPosts";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, SmileIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getUserByEmail, getUserFromTable } from "../../lib/UserLibs";
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4
import PostsList from "@/components/pages/PostsList";

const Page = () => {
    const { handleSubmit, control, setValue } = useForm();
    const [file, setFile] = useState(null);
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

                const { data: fileData, error: fileError } = await supabase.storage
                    .from("images")
                    .upload(`postingan/${imageName}`, file);

                if (fileError) {
                    console.error("Error uploading file:", fileError.message);
                    return;
                }

                imageUrl = `https://rujhylbasedavctyitpz.supabase.co/storage/v1/object/public/images/postingan/${imageName}`;
            }

            const { error: postError } = await supabase
                .from('posts')
                .insert([{ content: data.content, image_url: imageUrl, user_id: userDataFromTable.id }]);

            if (postError) {
                console.error({ postError: postError.message });
            } else {
                console.log('Post created successfully');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleImageUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const handleEmojiInsert = (emoji) => {
        setValue('content', (prev) => prev + emoji);
    };

    return (
        <main className="mx-auto container flex flex-col">
            <div className="flex flex-col sm:flex-row">
                {/* Sidebar for List of Users - Hidden on Mobile */}
                <aside className="hidden sm:w-1/4 sm:block p-4">
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul>
                                <li><a href="#">User 1</a></li>
                                <li><a href="#">User 2</a></li>
                                <li><a href="#">User 3</a></li>
                                <li><a href="#">User 4</a></li>
                            </ul>
                        </CardContent>
                    </Card>
                </aside>

                {/* Center for Bikin Postingan Form */}
                <section className="w-full sm:w-1/2 p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bikin Postingan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col">
                                <div className="flex space-x-2 mb-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleEmojiInsert("😊")}
                                        aria-label="Add Emoji"
                                    >
                                        <SmileIcon className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        aria-label="Add Image"
                                    >
                                        <label htmlFor="image-upload" className="cursor-pointer flex items-center">
                                            <ImageIcon className="w-5 h-5" />
                                            <input
                                                type="file"
                                                id="image-upload"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </Button>
                                </div>

                                <Controller
                                    name="content"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Textarea
                                            className="mt-4"
                                            placeholder="Write your post..."
                                            {...field}
                                        />
                                    )}
                                />

                                <Button
                                    className="w-full mt-4"
                                    variant="default"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Kirim Postingan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Right Sidebar for Recent Posts - Hidden on Mobile */}
                <aside className="hidden sm:w-1/4 sm:block p-4">
                    <RecentPosts />
                </aside>
            </div>

            {/* Display all posts */}
            <section className="w-full flex justify-center mt-8">
                
                  
                        <PostsList />
            </section>
        </main>
    );
};

export default Page;
