"use client";
import { Link as Linkg } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import ImageCropper from "@/lib/ImageCropper";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
export default function EditProfile() {
    const {toast} = useToast()
    const [profileImage, setProfileImage] = useState("/profile-picture.jpg"); // Default profile image
    const [userData, setUserData] = useState(null);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [croppedImageFile, setCroppedImageFile] = useState(null);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            noAbsen: "",
            username: "",
            bio: "",
            noIndukSiswa: "",
            link_ig: "",
            link_wa: "",
            link_git: "",
        },
    });

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login"); // Redirect to login page if not authenticated
            } else {
                const { data: userData, error: userError } = await supabase
                    .from("user")
                    .select("*")
                    .eq("email", user.email)
                    .single();

                if (userError) {
                    alert(userError.message);
                } else {
                    setUserData(userData);
                    setValue("noAbsen", userData.noAbsen);
                    setValue("username", userData.username);
                    setValue("bio", userData.bio);
                    setValue("noIndukSiswa", userData.noIndukSiswa);
                    setValue("link_wa", userData.link_wa);
                    setValue("link_git", userData.link_git);
                    setValue("link_ig", userData.link_ig);

                    if (userData.profile_picture_url) {
                        setProfileImage(userData.profile_picture_url);
                    }
                }
            }
        };

        checkAuth();
    }, [router, setValue]);

    const onSubmit = async (data) => {
        console.log(data); // Handle the submitted data (e.g., API request)

        let profilePictureUrl = profileImage;

        if (croppedImageFile) {
            // Upload the cropped image
            const { data: uploadData, error: uploadError } =
                await supabase.storage
                    .from("images")
                    .upload(
                        `images/${croppedImageFile.name}`,
                        croppedImageFile
                    );

            if (uploadError) {
                console.error("Error uploading image:", uploadError.message);
                return;
            }

            profilePictureUrl = `https://rujhylbasedavctyitpz.supabase.co/storage/v1/object/public/images/${uploadData.path}`;
        }

        // Update user profile based on current email
        const { error } = await supabase
            .from("user")
            .update({
                ...data,
                profile_picture_url: profilePictureUrl,
            })
            .eq("email", userData.email);

        if (error) {
            console.error("Error saving data:", error.message);
        } else {
            toast({
                title: "Berhasil Mengupdate Profile",
                description: "Di Redirecting Dalam Beberapa Saat",
                variant: "default",
            });

            setTimeout(() => {
                router.push(`/siswa/${userData.noIndukSiswa}`);
            }, 2500);
        
        }
    };

    const handleImageClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setImageToCrop(reader.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const base64ToBlob = (base64, mime = "image/png") => {
        const byteCharacters = atob(base64.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mime });
    };

    const handleCropDone = (croppedImage) => {
        const mimeType = croppedImage.split(";")[0].split(":")[1];
        const fileExtension = mimeType.split("/")[1];

        const fileName = `profile-picture-${uuidv4()}.${fileExtension}`;

        const blob = base64ToBlob(croppedImage, mimeType);
        const file = new File([blob], fileName, { type: mimeType });

        setProfileImage(URL.createObjectURL(blob));
        setCroppedImageFile(file);
        setImageToCrop(null); // Hide the cropper
    };

    const handleCropCancel = () => {
        setImageToCrop(null); // Hide the cropper
    };

    return (
        <div className="max-w-2xl mx-auto p-6 pb-20">
            <Card className=" rounded-lg shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">
                        Edit Profile
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center mb-4">
                            <Image
                                src={profileImage ? profileImage : "/default.webp"}
                                alt="Profile"
                                width={128}
                                height={128}
                                className=" rounded-full border cursor-pointer"
                                onClick={handleImageClick}
                            />
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Click to change profile picture
                            </p>
                        </div>

                        {/* Edit Form */}
                        <div className="space-y-4">
                            {/* Username Input */}
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                                    Nomor Absen
                                </label>
                                <Input
                                    placeholder="Masukkan Nomor Absen, Semisal 1"
                                    className="mt-1 p-2 border rounded-lg w-full bg-input dark:focus:outline-none dark:focus:ring-ring focus:outline-none  focus:ring-2 dark:ring-1 focus:ring-ring dark:bg-input dark:border-border "
                                    {...register("noAbsen", {
                                        required: "Username is required",
                                    })}
                                />
                                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                                    Nama Siswa
                                </label>
                                <Input
                                    placeholder="Masukkan Nama Kamu"
                                    className="mt-1 p-2 border rounded-lg w-full bg-input dark:focus:outline-none dark:focus:ring-ring focus:outline-none  focus:ring-2 dark:ring-1 focus:ring-ring dark:bg-input dark:border-border "
                                    {...register("username", {
                                        required: "Username is required",
                                    })}
                                />
                                {errors.username && (
                                    <p className="text-red-600 text-sm">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            {/* No Induk Siswa Input */}
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                                    No Induk Siswa
                                </label>
                                <Input
                                    placeholder="Enter your student ID"
                                    className="mt-1 p-2 border rounded-lg w-full bg-input dark:focus:outline-none dark:focus:ring-ring focus:outline-none  focus:ring-2 dark:ring-1 focus:ring-ring dark:bg-input dark:border-border "
                                    {...register("noIndukSiswa", {
                                        required: "No Induk Siswa is required",
                                    })}
                                />
                                {errors.noIndukSiswa && (
                                    <p className="text-red-600 text-sm">
                                        {errors.noIndukSiswa.message}
                                    </p>
                                )}
                            </div>

                            {/* Bio Input */}
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                                    Bio
                                </label>
                                <Textarea
                                    rows="4"
                                    placeholder="Tell something about yourself..."
                                    className="mt-1 p-2 border rounded-lg w-full bg-input dark:focus:outline-none dark:focus:ring-ring focus:outline-none  focus:ring-2 dark:ring-1 focus:ring-ring dark:bg-input dark:border-border "
                                    {...register("bio")}
                                />
                            </div>

                            <div>
                                <label className="flex  text-gray-700 dark:text-gray-300 font-medium">
                                    Link IG
                                </label>
                                <Input
                                    rows="4"
                                    placeholder="Tell something about yourself..."
                                    className="mt-1 p-2 border rounded-lg w-full bg-input dark:focus:outline-none dark:focus:ring-ring focus:outline-none  focus:ring-2 dark:ring-1 focus:ring-ring dark:bg-input dark:border-border "
                                    {...register("link_ig")}
                                />
                            </div>
                            <div>
                                <label className="flex  text-gray-700 dark:text-gray-300 font-medium">
                                    Link Whatsapp
                                </label>
                                <Input
                                    rows="4"
                                    placeholder="Tell something about yourself..."
                                    className="mt-1 p-2 border rounded-lg w-full bg-input dark:focus:outline-none dark:focus:ring-ring focus:outline-none  focus:ring-2 dark:ring-1 focus:ring-ring dark:bg-input dark:border-border "
                                    {...register("link_wa")}
                                />
                            </div>
                            <div>
                                <label className="flex  text-gray-700 dark:text-gray-300 font-medium">
                                    Link Github
                                </label>
                                <Input
                                    rows="4"
                                    placeholder="Tell something about yourself..."
                                    className="mt-1 p-2 border rounded-lg w-full bg-input dark:focus:outline-none dark:focus:ring-ring focus:outline-none  focus:ring-2 dark:ring-1 focus:ring-ring dark:bg-input dark:border-border "
                                    {...register("link_git")}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 mt-6">
                            <Button
                                className="w-full"
                                variant="default"
                                size="sm"
                                type="submit"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Image Cropper Fullscreen */}
            {imageToCrop && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative max-w-md w-full h-96">
                        <ImageCropper
                            image={imageToCrop}
                            onCropDone={handleCropDone}
                            onCropCancel={handleCropCancel}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
