"use client";
import React from "react";
import { useState } from "react";
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

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <main className=" bg-background dark:bg-background">
                {/* Make the entire Card a trigger for the modal */}

                <Card
                    onClick={() => setIsOpen(true)}
                    className="w-[450px] h-auto rounded-lg shadow-lg cursor-pointer"
                >
                    <CardContent>
                        <div className="flex flex-col items-center mt-6">
                            <Avatar className="mb-4">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h3 className="text-md font-semibold">
                                Ariena Maalika
                            </h3>
                            <h5 className="text-sm text-gray-500">
                                Oct 8, 2023
                            </h5>
                        </div>
                        <div className="mt-4">
                            <Image
                                src="https://rujhylbasedavctyitpz.supabase.co/storage/v1/object/public/images/postingan/c93f7d08-ff14-4ac5-bddd-cea4901d5545.jpg"
                                alt="Post Image"
                                height={500}
                                width={500}
                                className="rounded-md object-cover w-full h-auto"
                                layout="responsive"
                            />
                        </div>
                        {/* Title and Description Section */}
                        <div className="px-4 py-2">
                            <h4 className="text-lg font-bold mt-4">
                                Title of the Post
                            </h4>
                            <p className="text-sm text-gray-600 mt-2">
                                This is a brief description of the post. It
                                provides an overview of the content and gives
                                readers an idea of what to expect.
                            </p>
                        </div>
                        {/* Icons Section */}
                        <div className="flex justify-end px-4 py-2 space-x-4">
                            <MessageCircle className="text-gray-500 hover:text-primary cursor-pointer" />
                            <Share className="text-gray-500 hover:text-primary cursor-pointer" />
                        </div>
                    </CardContent>
                </Card>
                {isOpen && (
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        {/* Modal Content */}
                        <DialogContent className="sm:max-w-[800px] max-w-[90vw] max-h-[90vh] overflow-auto grid md:grid-cols-2 gap-4">
                            <div className="flex flex-col items-start justify-start gap-4 py-8">
                                <img
                                    src="https://rujhylbasedavctyitpz.supabase.co/storage/v1/object/public/images/postingan/c93f7d08-ff14-4ac5-bddd-cea4901d5545.jpg"
                                    width={800}
                                    height={450}
                                    alt="Post image"
                                    className="object-cover aspect-video rounded-lg w-full"
                                />
                            </div>
                            <div className="flex flex-col items-start justify-start gap-4 py-8">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">
                                        Excited to share my latest project!
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage
                                                src="/placeholder-user.jpg"
                                                alt="@shadcn"
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <div className="font-medium">
                                                Olivia Davis
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Oct 8, 2023
                                            </div>
                                        </div>
                                    </div>
                                    <p>
                                        I've been working hard on this for the
                                        past few months and I'm really proud of
                                        the end result. Let me know what you
                                        think!
                                    </p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </main>
        </>
    );
}
