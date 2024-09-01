"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { MessageCircle, Share } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <main className="bg-background dark:bg-background">
                {/* Center the Card on the screen */}
                <div className="flex justify-center items-center h-screen">
                    <section className="relative flex flex-col">
                        <Card className="relative w-[800px] h-[416px]">
                            <Image
                                src="/chara01.jpg"
                                height={420}
                                width={800}
                                objectFit="cover"
                                alt="Character Image"
                            />
                            {/* Container for text details */}
                            <div className="absolute top-0 right-20 p-4 bg-gradient-to-t  rounded-md">
                                <h1 className="text-2xl font-semibold text-primary-foreground">
                                    Vioriena
                                </h1>
                                <Separator />
                            </div>
                            <div className="absolute top-20 right-6 bg-gradient-to-t  rounded-md w-[235px]">
                                <p className="text-md text-primary-foreground">
                                    Hi, I'm Ariena Maalika. You can call me Lina
                                    or Arin. I'm a software engineer focused on
                                    mobile development, particularly native
                                    apps. Apologies for not sharing a proper
                                    image; I prefer not to show my face to the
                                    public. Though my boyfriend has posted a
                                    photo of me on his profile, I still prefer
                                    to keep a low profile.
                                </p>
                                <p className="mt-2 text-center">
                                    My Instagram
                                </p>
                            </div>
                        </Card>
                        {/* <Card className="relative w-[800px] h-[416px]">
                            <Image
                                src="/chara02.jpg"
                                height={420}
                                width={800}
                                objectFit="cover"
                                alt="Character Image"
                            />
                           
                            <div className="absolute top-0 left-20 p-4 bg-gradient-to-t  rounded-md">
                                <h1 className="text-2xl text-center font-semibold text-primary-foreground">
                                    Usagi
                                </h1>
                                <Separator />
                            </div>
                            <div className="absolute top-20 left-6 bg-gradient-to-t  rounded-md w-[235px]">
                                <p className="text-md text-primary-foreground">
                                    Hi, I'm Ariena Maalika. You can call me Lina
                                    or Arin. I'm a software engineer focused on
                                    mobile development, particularly native
                                    apps. Apologies for not sharing a proper
                                    image; I prefer not to show my face to the
                                    public. Though my boyfriend has posted a
                                    photo of me on his profile, I still prefer
                                    to keep a low profile.
                                </p>
                                <p className="mt-2 text-center">
                                    My Instagram
                                </p>
                            </div>
                        </Card> */}
                    </section>
                </div>
            </main>
        </>
    );
}
