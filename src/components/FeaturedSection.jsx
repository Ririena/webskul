// components/FeaturedSection.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FeaturedSection = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] px-4 py-8 bg-gradient-to-b from-blue-500 to-blue-300 text-white">
            <Card className="max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Featured Content
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center">
                        Discover our amazing features that help you build
                        stunning web applications with ease.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default FeaturedSection;
