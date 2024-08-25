// components/SocialMediaCard.js
import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const SocialMediaCard = () => {
    const socialLinks = {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Social Media</h3>
            <div className="flex space-x-4">
                <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                >
                    <Facebook size={24} />
                </a>
                <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                >
                    <Twitter size={24} />
                </a>
                <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800"
                >
                    <Instagram size={24} />
                </a>
                <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900"
                >
                    <Linkedin size={24} />
                </a>
            </div>
        </div>
    );
};

export default SocialMediaCard;
