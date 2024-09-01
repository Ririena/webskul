import { Card } from "../ui/card";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useRouter } from "next/navigation";
export default function Person() {
    const router = useRouter()

    function handleVioriena() {
        router.push("https://www.instagram.com/ririenesu/")
    }

    function handleZaychik() {
        router.push("https://www.instagram.com/elzaychikk/")
    }
    // Controls for the first card
    const controls1 = useAnimation();
    const ref1 = useRef(null);
    const inView1 = useInView(ref1, { once: false });

    // Controls for the second card
    const controls2 = useAnimation();
    const ref2 = useRef(null);
    const inView2 = useInView(ref2, { once: false });

    useEffect(() => {
        if (inView1) {
            controls1.start("visible");
        } else {
            controls1.start("hidden");
        }
    }, [inView1, controls1]);

    useEffect(() => {
        if (inView2) {
            controls2.start("visible");
        } else {
            controls2.start("hidden");
        }
    }, [inView2, controls2]);

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const textVariants = {
        hidden: { opacity: 0 },
        visible: (delay = 0) => ({
            opacity: 1,
            transition: { delay, duration: 0.8 },
        }),
    };

    return (
        <>
            <main className="">
                {/* Center the Card on the screen */}
                <div className="flex justify-center items-center ">
                    <section className="relative flex flex-col">
                        {/* First Card with motion.div for animation */}
                        <motion.div
                            ref={ref1}
                            initial="hidden"
                            animate={controls1}
                            variants={cardVariants}
                        >
                            <Card className="relative w-[800px] h-[416px] rounded-md">
                                <Image
                                    src="/chara01.jpg"
                                    height={420}
                                    width={800}
                                    objectFit="cover"
                                    alt="Character Image"
                                />
                                {/* Container for text details */}
                                <motion.div
                                    className="absolute top-0 right-20 p-4 bg-gradient-to-t rounded-md"
                                    variants={textVariants}
                                    initial="hidden"
                                    animate={controls1}
                                    custom={0.5} // delay for animation
                                >
                                    <h1 className="text-2xl font-semibold dark:text-primary-foreground">
                                        Vioriena
                                    </h1>
                                    <Separator />
                                </motion.div>
                                <motion.div
                                    className="absolute top-20 right-6 bg-gradient-to-t rounded-md w-[235px]"
                                    variants={textVariants}
                                    initial="hidden"
                                    animate={controls1}
                                    custom={0.7} // delay for animation
                                >
                                    <p className="text-md dark:text-primary-foreground">
                                        Hi, I'm Ariena Maalika. You can call me
                                        Lina or Arin. I'm a software engineer
                                        focused on mobile development,
                                        particularly native apps. Apologies for
                                        not sharing a proper image; I prefer not
                                        to show my face to the public. Though my
                                        boyfriend has posted a photo of me on
                                        his profile, I still prefer to keep a
                                        low profile.
                                    </p>
                                    <Button onClick={handleVioriena} className="mt-2  hover:cursor-pointer text-center">
                                        My Instagram
                                    </Button>
                                </motion.div>
                            </Card>
                        </motion.div>

                        {/* Second Card with motion.div for animation */}
                        <motion.div
                            ref={ref2}
                            initial="hidden"
                            animate={controls2}
                            variants={cardVariants}
                            className="" // Add some margin to separate the cards
                        >
                            <Card className="relative w-[800px] h-[416px] rounded-md">
                                <Image
                                    src="/chara02.jpg"
                                    height={420}
                                    width={800}
                                    objectFit="cover"
                                    alt="Character Image"
                                />
                                <motion.div
                                    className="absolute top-0 left-20 p-4 bg-gradient-to-t rounded-md"
                                    variants={textVariants}
                                    initial="hidden"
                                    animate={controls2}
                                    custom={0.5} // delay for animation
                                >
                                    <h1 className="text-2xl text-center font-semibold dark:text-primary-foreground">
                                        Usagi
                                    </h1>
                                    <Separator />
                                </motion.div>
                                <motion.div
                                    className="absolute top-20 left-6 bg-gradient-to-t rounded-md w-[235px]"
                                    variants={textVariants}
                                    initial="hidden"
                                    animate={controls2}
                                    custom={0.7} // delay for animation
                                >
                                    <p className="text-md dark:text-primary-foreground">
                                        Hi, I'm Adlin. I created this website
                                        with her. I added features called
                                        Dynamic Functions so my colleagues can
                                        interact with the content without
                                        touching the code or changing my
                                        repository. To be honest, I really
                                        struggle with SEO. I know this isn't a
                                        description, but happy coding, everyone!
                                    </p>
                                    <Button onClick={handleZaychik} className="hover:cursor-pointer mt-2 text-center">
                                        My Instagram
                                    </Button>
                                </motion.div>
                            </Card>
                        </motion.div>
                    </section>
                </div>
            </main>
        </>
    );
}
