import React from "react";
import Link from "next/link";
import { Home, Book, Box, StickyNote } from "lucide-react";

export default function BottomNavigation() {
    return (
        <div className="fixed bottom-0 inset-x-0 bg-primary-foreground dark:bg-card  shadow-lg lg:hidden z-50">
            <div className="flex justify-between items-center py-2  ">
                <Link
                    href="/"
                    className="text-center flex-1 flex flex-col items-center"
                >
                    <Home className="" size={24} />
                    <p className="text-sm  mt-1">Home</p>
                </Link>
                <Link
                    href="/campaign/1"
                    className="text-center flex-1 flex flex-col items-center"
                >
                    <StickyNote className="" size={24} />
                    <p className="text-sm  mt-1">Campaign</p>
                </Link>
                <Link
                    href="/plot"
                    className="text-center flex-1 flex flex-col items-center"
                >
                    <Book className="" size={24} />
                    <p className="text-sm  mt-1">Plot</p>
                </Link>
                <Link
                    href="/profile"
                    className="text-center flex-1 flex flex-col items-center"
                >
                    <Box className="" size={24} />
                    <p className="text-sm  mt-1">Profile</p>
                </Link>
            </div>
        </div>
    );
}
