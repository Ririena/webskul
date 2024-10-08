"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import SocialMediaCard from "@/components/pages/SocialMediaCard";
import RecentPosts from "@/components/pages/RecentPosts";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Page() {
    const [siswaData, setSiswaData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { detailsiswa } = useParams(); // Access the dynamic parameter

    // Decode the parameter to handle any URL-encoded characters
    const decodedDetailSiswa = decodeURIComponent(detailsiswa);

    // Split the parameter to extract noIndukSiswa and namaSiswa
    // Assume the first hyphen separates noIndukSiswa from namaSiswa
    const [noIndukSiswa, ...namaSiswaParts] = decodedDetailSiswa.split("-");
    const namaSiswa = namaSiswaParts.join("-");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch siswa data based on noIndukSiswa
                const { data: siswa, error: siswaError } = await supabase
                    .from("siswa")
                    .select("*")
                    .eq("noIndukSiswa", noIndukSiswa)
                    .single();

                if (siswaError) throw siswaError;

                setSiswaData(siswa);

                // Fetch user data based on noIndukSiswa
                const { data: user, error: userError } = await supabase
                    .from("user")
                    .select("*")
                    .eq("noIndukSiswa", noIndukSiswa)
                    .single();

                if (userError) throw userError;

                setUserData(user);
            } catch (error) {
                console.error("Error fetching data:", error.message);
                setError("Error fetching data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [noIndukSiswa]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    if (!siswaData || !userData) {
        return <p>No data available.</p>;
    }

    const socialLinks = {
        instagram: userData.link_ig || null,
        github: userData.link_git || null,
        whatsapp: userData.link_wa || null,
    };

    return (
        <main className="mx-auto container p-6 space-y-6 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile image column */}
                <div className="col-span-1">
                    <div className="relative bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
                        <Image
                            src={
                                userData.profile_picture_url ||
                                "/default.webp"
                            }
                            alt={`${userData.username || "User"}'s profile`}
                            width={1200}
                            height={600}
                            className="w-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                            <h2 className="text-3xl font-bold text-white">
                                {userData.username || "Unknown User"}
                            </h2>
                        </div>
                    </div>
                    <Card className="mt-4">
                        <CardContent className="shadow-lg rounded-lg p-6">
                            <p className="text-sm dark:text-primary">
                                No Induk Siswa: {siswaData.noIndukSiswa}
                            </p>
                            <p className="text-sm dark:text-primary">
                                Gender:{" "}
                                {siswaData.gender === 1
                                    ? "Laki Laki"
                                    : "Perempuan"}
                            </p>
                            <p className="text-sm mt-4 dark:text-primary">
                                Bio: {userData.bio || "Bio not available."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Profile details column */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    {/* Add Static Social Media Card */}
                    <SocialMediaCard socialLinks={socialLinks} />

                    {/* Add Recent Posts Section */}
                    <RecentPosts />
                </div>

                {/* Additional information or actions column */}
                <div className="col-span-1">
                    <Card className="shadow-lg rounded-lg p-6">
                        <Button
                            className="w-full"
                            onClick={() => window.history.back()}
                        >
                            Back to List
                        </Button>
                    </Card>
                </div>
            </div>
        </main>
    );
}
