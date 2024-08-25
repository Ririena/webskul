"use client";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import Header from "@/components/navigation/Header";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import {useState, useEffect} from 'react'
export default function Home() {
  const { theme } = useTheme();

  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    setThemeLoaded(true);
  }, [theme]);

  if (!themeLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Header />
      <main>
        <div
          className={`absolute top-16 z-[-2] h-screen w-screen ${
            theme === "light"
              ? "absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
              : "" // Example for dark mode
          }`}
        >
          <section className="flex flex-col justify-center items-center h-[65vh] px-4">
            <Badge className="p-2 mb-4">
              Website XI PPLG 2, Will Release Soon 🚀
            </Badge>
            <h3 className="text-5xl font-bold text-center">
              Selamat Datang Di,
            </h3>
            <h4 className="text-5xl font-bold text-center mt-4">XI PPLG 2</h4>
          </section>
        </div>
      </main>
      <BottomNavigation/>
    </>
  );
}
