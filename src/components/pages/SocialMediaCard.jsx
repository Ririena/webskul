// components/SocialMediaCard.js
import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Card } from "../ui/card";
import Link from "next/link";

const SocialMediaCard = () => {
    const socialLinks = {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
    };

    return (
        <Card className="bg-card shadow-lg rounded-lg p-6">
            <h3 className="text-xl text-primary font-bold mb-4">
                Social Media
            </h3>
            <div className="flex space-x-4">
                <Link
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                >
                    <Facebook size={24} />
                </Link>
                <Link
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                >
                    <Twitter size={24} />
                </Link>
                <Link
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800"
                >
                    <Instagram size={24} />
                </Link>
                <Link
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900"
                >
                    <Linkedin size={24} />
                </Link>
            </div>
        </Card>
    );
};

export default SocialMediaCard;
