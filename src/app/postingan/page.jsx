"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RecentPosts from "@/components/pages/RecentPosts";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, SmileIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getUserByEmail, getUserFromTable } from "../../lib/UserLibs";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import PostsList from "@/components/pages/PostsList";
import Fab from "@/components/FAB";
import CreatePostForm from "@/components/CreatePostForm";

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
                    content: data.content,
                    image_url: imageUrl,
                    user_id: userDataFromTable.id,
                },
            ]);

            if (postError) {
                console.error({ postError: postError.message });
            } else {
                console.log("Post created successfully");
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const handleImageUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const handleEmojiInsert = (emoji) => {
        setValue("content", (prev) => prev + emoji);
    };

    return (
        <main className="mx-auto container flex flex-col">
            <div className="flex justify-center items-center">
                <section className="w-full  p-4 ">
                    <CreatePostForm />
                </section>
            </div>
            {/* Display all posts */}
            <section className="w-full flex justify-center mt-8">
                <PostsList />
            </section>
         
        </main>
    );
};

export default Page;
