import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Image } from "@nextui-org/react";
import Person from "./Sponsor/Person";
import Link from "next/link";
import TechnologyCard from "./Sponsor/TechnlogyCard";
const SponsorSection = () => {
    const sponsors = [
        {
            name: "Next Js",
            logo: "/nextjs.png",
            url: "https://sponsor1.com",
        },
        {
            name: "Supabase",
            logo: "/path-to-sponsor2-logo.png",
            url: "https://sponsor2.com",
        },
        {
            name: "Logic",
            logo: "/path-to-sponsor3-logo.png",
            url: "https://sponsor3.com",
        },
    ];

    const honorableMentions = [
        {
            name: "Ariena AlMaalika",
            logo: "/006jClaAgy1fey18uarkhj30qo1bf11x.jpg",
            url: "https://honorable1.com",
        },
        {
            name: "Honorable Mention 2",
            logo: "/path-to-honorable2-logo.png",
            url: "https://honorable2.com",
        },
    ];

    return (
        <section className="py-16 bg-gray-100 dark:bg-neutral-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 sm:text-4xl">
                    Honorable Mention
                </h2>

                <div className="hidden sm:block">
                    <Person />
                </div>
            </div>
        </section>
    );
};

export default SponsorSection;
