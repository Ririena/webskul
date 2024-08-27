"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import ImageCropper from "@/lib/ImageCropper";
import BannerCropper from "@/lib/BannerCropper";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

export default function EditProfile() {
    const { toast } = useToast();
    const [isImageSelecting, setIsImageSelecting] = useState(""); // Initialize as an empty string
    const [profileImage, setProfileImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [userData, setUserData] = useState(null);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [croppedBannerFile, setCroppedBannerFile] = useState(null);
    const [croppedProfileFile, setCroppedProfileFile] = useState(null);
    const router = useRouter();

    const fileInputRefProfile = useRef(null); 
    const fileInputRefBanner = useRef(null); 

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
                router.push("/login");
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

                    if (userData.banner_url) {
                        setBannerImage(userData.banner_url);
                    }
                }
            }
        };

        checkAuth();
    }, [router, setValue]);

    const onSubmit = async (data) => {
        let profilePictureUrl = profileImage;
        let bannerUrl = bannerImage;

        if (croppedBannerFile) {
            const { data: uploadData, error: uploadError } =
                await supabase.storage
                    .from("images")
                    .upload(
                        `banners/${uuidv4()}-${croppedBannerFile.name}`,
                        croppedBannerFile
                    );

            if (uploadError) {
                console.error("Error uploading banner:", uploadError.message);
                return;
            }

            bannerUrl = `https://rujhylbasedavctyitpz.supabase.co/storage/v1/object/public/images/${uploadData.path}`;
        }

        if (croppedProfileFile) {
            const { data: uploadData, error: uploadError } =
                await supabase.storage
                    .from("images")
                    .upload(
                        `profiles/${uuidv4()}-${croppedProfileFile.name}`,
                        croppedProfileFile
                    );

            if (uploadError) {
                console.error(
                    "Error uploading profile picture:",
                    uploadError.message
                );
                return;
            }

            profilePictureUrl = `https://rujhylbasedavctyitpz.supabase.co/storage/v1/object/public/images/${uploadData.path}`;
        }

        const { error } = await supabase
            .from("user")
            .update({
                ...data,
                profile_picture_url: profilePictureUrl,
                banner_url: bannerUrl,
            })
            .eq("email", userData.email);

        if (error) {
            console.error("Error saving data:", error.message);
        } else {
            toast({
                title: "Profile updated successfully",
                description: "Redirecting in a few seconds...",
                variant: "default",
            });

            setTimeout(() => {
                router.push(`/siswa/${userData.noIndukSiswa}`);
            }, 2500);
        }
    };

    const openImageSelector = (type) => {
        setIsImageSelecting(type);
        if (type === "profile") {
            fileInputRefProfile.current?.click(); // Open profile file input
        } else if (type === "banner") {
            fileInputRefBanner.current?.click(); // Open banner file input
        }
    };

    const handleFileChangeProfile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result);
                setIsImageSelecting("profile");
            };
            reader.readAsDataURL(file);
        }
        event.target.value = '';
    };

    const handleFileChangeBanner = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result);
                setIsImageSelecting("banner");
            };
            reader.readAsDataURL(file);
        }
        event.target.value = '';
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

    const handleCropDone = (croppedImage, type) => {
        const mimeType = croppedImage.split(";")[0].split(":")[1];
        const fileExtension = mimeType.split("/")[1];
        const fileName = `${type}-${uuidv4()}.${fileExtension}`;
        const blob = base64ToBlob(croppedImage, mimeType);
        const file = new File([blob], fileName, { type: mimeType });

        if (type === "profile") {
            setProfileImage(URL.createObjectURL(blob));
            setCroppedProfileFile(file);
        } else if (type === "banner") {
            setBannerImage(URL.createObjectURL(blob));
            setCroppedBannerFile(file);
        }
        setImageToCrop(null);
    };

    const handleCropCancel = () => {
        setImageToCrop(null);
        setIsImageSelecting("");
        // Reset the file inputs to ensure they can be selected again
        if (fileInputRefProfile.current) {
            fileInputRefProfile.current.value = '';
        }
        if (fileInputRefBanner.current) {
            fileInputRefBanner.current.value = '';
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 pb-20">
            <Card className="rounded-lg shadow-lg">
                {/* Banner Section */}
                <div className="relative w-full h-48 bg-blue-500 rounded-lg flex justify-center items-center cursor-pointer">
                    <div
                        onClick={() => openImageSelector("banner")}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={bannerImage ? bannerImage : "/default.webp"}
                            alt="Banner"
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-lg"
                        />
                    </div>

                    {/* Profile Picture */}
                    <div
                        className="absolute -bottom-8 w-32 h-32 rounded-full border-4 border-white overflow-hidden cursor-pointer"
                        onClick={() => openImageSelector("profile")}
                    >
                        <Image
                            src={profileImage ? profileImage : "/default.webp"}
                            alt="Profile"
                            fill
                            style={{ objectFit: "cover" }}
                            className="object-cover"
                        />
                    </div>
                </div>

                <CardHeader>
                    <CardTitle className="text-2xl pt-12 font-semibold text-center">
                        Edit Profile
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="space-y-4">
                            {/* No Absen Input */}
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                                    Nomor Absen
                                </label>
                                <Input
                                    placeholder="Masukkan Nomor Absen, Semisal 1"
                                    className="mt-1 p-2 border rounded-lg w-full"
                                    {...register("noAbsen", {
                                        required: "Nomor Absen is required",
                                    })}
                                />
                                {errors.noAbsen && (
                                    <p className="text-red-600 text-sm">
                                        {errors.noAbsen.message}
                                    </p>
                                )}
                            </div>

                            {/* Username Input */}
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                                    Nama Siswa
                                </label>
                                <Input
                                    placeholder="Masukkan Nama Kamu"
                                    className="mt-1 p-2 border rounded-lg w-full"
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
                                    placeholder="Masukkan No Induk Siswa"
                                    className="mt-1 p-2 border rounded-lg w-full"
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
                                    className="mt-1 p-2 border rounded-lg w-full"
                                    {...register("bio")}
                                />
                            </div>

                            {/* Social Links */}
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                                    Link IG
                                </label>
                                <Input
                                    placeholder="Masukkan Link Instagram"
                                    className="mt-1 p-2 border rounded-lg w-full"
                                    {...register("link_ig")}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                                    Link Whatsapp
                                </label>
                                <Input
                                    placeholder="Masukkan Link Whatsapp"
                                    className="mt-1 p-2 border rounded-lg w-full"
                                    {...register("link_wa")}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                                    Link Github
                                </label>
                                <Input
                                    placeholder="Masukkan Link Github"
                                    className="mt-1 p-2 border rounded-lg w-full"
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

            <input
                type="file"
                accept="image/*"
                ref={fileInputRefProfile}
                style={{ display: "none" }}
                onChange={handleFileChangeProfile}
            />
            <input
                type="file"
                accept="image/*"
                ref={fileInputRefBanner}
                style={{ display: "none" }}
                onChange={handleFileChangeBanner}
            />

            {/* Image Cropper Fullscreen */}
            {imageToCrop && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative max-w-md w-full h-96">
                        {isImageSelecting === "profile" ? (
                            <ImageCropper
                                image={imageToCrop}
                                onCropDone={(croppedImage) =>
                                    handleCropDone(croppedImage, "profile")
                                }
                                onCropCancel={handleCropCancel}
                            />
                        ) : (
                            <BannerCropper
                                image={imageToCrop}
                                onCropDone={(croppedImage) =>
                                    handleCropDone(croppedImage, "banner")
                                }
                                onCropCancel={handleCropCancel}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
