'use client'
import React from "react";
import Link from "next/link";
import { Home, Book, Box, StickyNote } from "lucide-react";
import { PersonStanding } from 'lucide-react';
import { Smile } from 'lucide-react';
import { UserRoundSearch } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';
import { NotepadText } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import {useEffect, useState} from 'react'
import { getUserByEmail, getUserFromTable } from "@/lib/UserLibs";

export default function BottomNavigation() {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentNIK, setCurrentNIK] = useState(null)
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await getUserByEmail();
                if (user) {
                    const userDataFromTable = await getUserFromTable(
                        user.email
                    );
                    if (userDataFromTable) {
                        setCurrentUser(userDataFromTable.id); // Ensure currentUser is set correctly
                        setCurrentNIK(userDataFromTable.noIndukSiswa)
                    }
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };
        fetchCurrentUser();
    }, []);

    const profileLink = currentNIK ? `/siswa/${currentNIK}` : '/siswa';
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
                    href="/siswa"
                    className="text-center flex-1 flex flex-col items-center"
                >
                      <UserRoundSearch />
                    <p className="text-sm  mt-1">Daftar Siswa</p>
                </Link>
                <Link
                    href="/postingan"
                    className="text-center flex-1 flex flex-col items-center"
                >
                 <NotepadText />
                    <p className="text-sm  mt-1">postingan</p>
                </Link>
             
                <Link
                    href={profileLink}
                    className="text-center flex-1 flex flex-col items-center"
                >
                    <CircleUserRound />
                    <p className="text-sm  mt-1">Profile</p>
                </Link>
            </div>
        </div>
    );
}