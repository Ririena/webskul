import React from "react";
import {
    Card,
    CardFooter,
    CardContent,
    CardTitle,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
export default function page() {
    return (
        <>
            <main className="mx-auto container">
                <div className="flex justify-center items-center">
                    <Card className="w-[500px] mt-12">
                        <CardHeader>
                            <CardTitle className="text-left">
                                Bikin Postingan
                            </CardTitle>

                            <Separator />
                        </CardHeader>
                        <CardContent>
                            <Image
                                src="/default.webp"
                                height={50}
                                width={50}
                                className="rounded-full mx-auto"
                            />
                            <Textarea />
                        </CardContent>
                        <Separator />

                        <div className="flex justify-between m-2">
                            <div className="flex flex-row gap-2">
                                <h1>ICON</h1>
                                <h1>ICON</h1>
                                <h1>ICON</h1>
                            </div>
                        </div>
                        <div>
                            <Button className="w-full" variant="default">
                                Kirim Postingan
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        </>
    );
}
