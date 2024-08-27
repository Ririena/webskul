"use client";

import React from "react";
import { Instagram, Github, Whatsapp } from "lucide-react";
import { Card } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const SocialMediaCard = ({ socialLinks }) => {
    const router = useRouter();

    const handleEdit = () => {
        router.push("/profile/editprofile");
    };

    return (
        <Card className="bg-card shadow-lg rounded-lg p-6">
            <div className="flex justify-between">
                <h3 className="text-xl text-primary font-bold mb-4">
                    Social Media
                </h3>
                <Button onClick={handleEdit}>Edit</Button>
            </div>
            <div className="flex space-x-4">
                {socialLinks.instagram && (
                    <Link
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-800"
                    >
                            <Instagram size={24} />
                    </Link>
                )}
                {socialLinks.github && (
                    <Link
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-900"
                    >
                        <Github size={24} />
                    </Link>
                )}
                {socialLinks.whatsapp && (
                    <Link
                        href={socialLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800"
                    >
                        <Whatsapp size={24} />
                    </Link>
                )}
            </div>
        </Card>
    );
};

export default SocialMediaCard;
