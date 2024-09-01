import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

const ImageCarousel = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const openDialog = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const closeDialog = () => {
        setSelectedImage(null);
    };

    const images = ["/myc1.jpg", "/myc2.jpg", "/myc3.jpg", "/myc4.jpg", "/myc5.jpg"];

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 sm:text-4xl">
                    Our Gallery
                </h2>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={true}
                    spaceBetween={15} // Default space between slides
                    centeredSlides={true}
                    slidesPerView={3} // Default slides per view
                    breakpoints={{
                        0: { // Applies to mobile screens
                            slidesPerView: 1.2, // Show 1 slide on smaller screens
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 1.5, // Show 1.2 slides on slightly larger screens
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 2.5, // Show 2.5 slides on medium screens
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 3, // Show 3 slides on larger screens
                            spaceBetween: 40,
                        },
                    }}
                    className="w-full h-[400px] sm:h-[500px] lg:h-[600px]"
                >
                    {images.map((src, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="w-full h-full flex items-center justify-center cursor-pointer"
                                onClick={() => openDialog(src)}
                            >
                                <Image
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Dialog for displaying full-size image */}
                <Dialog open={!!selectedImage} onOpenChange={closeDialog}>
                    <DialogTrigger asChild>
                        <div />
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-3xl p-0">
                        {selectedImage && (
                            <Image
                                src={selectedImage}
                                alt="Full-size image"
                                layout="responsive"
                                width={1200}
                                height={800}
                                objectFit="contain"
                                className="rounded-lg"
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
};

export default ImageCarousel;
