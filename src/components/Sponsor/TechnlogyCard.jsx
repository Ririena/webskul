import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Image } from "@nextui-org/react";
import Link from "next/link";

const TechnologyCard = ({ name, logo, url }) => {
    return (
        <Card className="max-w-lg w-[250px] rounded overflow-hidden shadow-lg my-4">
            <CardHeader>
                <Link href={url} passHref>
                    <Card className="w-full h-full">
                        <Image
                            src={logo}
                            alt={name}
                            layout="fill"
                            objectFit="cover"
                            className="mx-auto object-cover"
                        />
                    </Card>
                </Link>
            </CardHeader>
            <CardContent>
                <CardTitle className="text-center text-lg font-bold">
                    {name}
                </CardTitle>
            </CardContent>
        </Card>
    );
};

export default TechnologyCard;
