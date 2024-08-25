"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Image as Gambar } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
const SectionProd = () => {
    const { theme } = useTheme();
    const [themeLoaded, setThemeLoaded] = useState(false);

    useEffect(() => {
        setThemeLoaded(true);
    }, [theme]);

    if (!themeLoaded) {
        return <div>Loading...</div>;
    }
    return (
        <div className="container py-12 lg:py-24 px-4 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center">
                <div className="lg:col-span-3 mb-12 lg:mb-0">
                    <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                        XI RPL 2, Duivion
                    </h1>
                    <p className="mt-3 text-lg sm:text-xl text-muted-foreground">
                        Alasan website ini dibuat karena untuk menyimpan data
                        dan memori selama belajar di prodi PPLG serta SMKN 7
                        Baleendah.
                    </p>
                    <div className="mt-5 lg:mt-8 flex flex-col sm:items-center gap-4 sm:flex-row sm:gap-6">
                        <div className="w-full max-w-sm lg:max-w-md">
                            <Label className="sr-only">Search</Label>
                            <Input
                                placeholder="Enter work email"
                                type="email"
                            />
                        </div>
                        <Button className="w-full sm:w-auto">
                            Request demo
                        </Button>
                    </div>
                </div>
                <div className="lg:col-span-4">
                    <Card className="bg-card dark:bg-card">
                        <img
                            className={`w-full rounded-xl object-cover`}
                            src={`${
                                theme === "light"
                                    ? "/pub.png"
                                    : "/logo_kelas.jpg"
                            }`}
                            alt="Image Description"
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SectionProd;
