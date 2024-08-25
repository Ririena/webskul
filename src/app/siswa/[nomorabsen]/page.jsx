"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import SocialMediaCard from "@/components/pages/SocialMediaCard";
import RecentPosts from "@/components/pages/RecentPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription,CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
export default function Page() {
    const { nomorabsen } = useParams();
    const [siswaData, setSiswaData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: siswa, error: siswaError } = await supabase
                    .from("siswa")
                    .select("*")
                    .eq("nomor_absen", nomorabsen)
                    .single();

                if (siswaError) throw siswaError;

                setSiswaData(siswa);

                const { data: user, error: userError } = await supabase
                    .from("user")
                    .select("*")
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
    }, [nomorabsen]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    if (!siswaData || !userData) {
        return <p>No data available.</p>;
    }

    return (
        <main className="mx-auto container p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile image column */}
                <div className="col-span-1">
                    <div className="relative bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
                        <Image
                            src={
                                userData.profile_picture_url ||
                                "/default-profile.png"
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

                    <CardContent className="bg-primary-foreground shadow-lg rounded-lg p-6">
                        <p className="text-sm text-primary">
                            No Induk Siswa: {siswaData.noIndukSiswa}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Gender:{" "}
                            {siswaData.gender === 1 ? "Laki Laki" : "Perempuan"}
                        </p>
                        <p className="text-sm mt-4 text-gray-700 dark:text-gray-300">
                            Bio: {userData.bio || "Bio not available."}
                        </p>
                    </CardContent>
                    </Card>

                </div>

                {/* Profile details column */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    {/* Add Static Social Media Card */}
                    <SocialMediaCard />

                    {/* Add Recent Posts Section */}
                    <RecentPosts />
                </div>

                {/* Additional information or actions column */}
                <div className="col-span-1">
                    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
                        <Button onClick={() => window.history.back()}>
                            Back to List
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
