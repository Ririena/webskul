"use client";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import Header from "@/components/navigation/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Image } from "@nextui-org/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSwiperReactive } from "@/lib/useSwiperReact";
import {
    Navigation,
    Pagination,
    Scrollbar,
    A11y,
    Autoplay,
} from "swiper/modules";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
export default function Home() {
    const { theme } = useTheme();
    const [themeLoaded, setThemeLoaded] = useState(false);

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const swiper = useSwiperReactive();

    useEffect(() => {
        setThemeLoaded(true);
    }, [theme]);

    if (!themeLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <main className="absolute top-16 z-[-2] h-screen w-screen ">
                <div
                    className={` ${
                        theme === "light"
                            ? "absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
                            : ""
                    }`}
                >
                    <section className="flex flex-col justify-center items-center h-[85vh] px-4 py-8 sm:py-16 lg:px-8 lg:py-24">
                        <Badge className="p-2 mb-4 text-center">
                            Website XI PPLG 2, Will Release Soon 🚀
                        </Badge>
                        <h3 className="text-4xl font-bold text-center sm:text-5xl">
                            Selamat Datang Di,
                        </h3>
                        <h4 className="text-4xl font-bold text-center mt-4 sm:text-5xl">
                            XI PPLG 2
                        </h4>
                        <div className="mt-5 max-w-2xl sm:max-w-3xl">
                            <p className="text-lg text-center sm:text-xl text-muted-foreground dark:text-primary">
                                Over 10+ fully responsive UI blocks you can drop
                                into your Shadcn UI projects and customize to
                                your heart&apos;s content.
                            </p>
                        </div>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                            <Button size={"lg"} className="w-full sm:w-auto">
                                Get started
                            </Button>
                            <Button
                                size={"lg"}
                                variant={"outline"}
                                className="w-full sm:w-auto"
                            >
                                Learn more
                            </Button>
                        </div>
                    </section>
                    <div className="mb-[77px]"></div>
                    <Separator className="" />
                

                    <section className="pb-[1000px]">
                        {/*CAROUSEL THIS ONE */}
                        <h3 className=" text-2xl sm:text-3xl text-center mt-12 ">
                            Galeri XI RPL 2
                        </h3>
                        <div className="flex justify-center items-center mb-8"></div>
                        <div className=" slider-container space-x-4">
                            <Slider {...settings}>
                                <div>
                                    <Image src="/myc2.jpg" />
                                </div>
                                <div>
                                    <Image src="/myc2.jpg" />
                                </div>
                                <div>
                                    <Image src="/myc2.jpg" />
                                </div>
                                <div>
                                    <Image src="/myc2.jpg" />
                                </div>
                            </Slider>
                        </div>
                    </section>
                    <Separator className="" />
                </div>
                <Separator />
            </main>
            <BottomNavigation />
        </>
    );
}
