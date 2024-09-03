"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

// Dynamically import SkeletonCard
const SkeletonCard = lazy(() => import("@/components/SkeletonCard"));



const PageSiswa = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const currentPathname = usePathname();
    const [siswaList, setSiswaList] = useState([]);
    const [filteredSiswaList, setFilteredSiswaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterGender, setFilterGender] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
const handleDetailClick = (siswa) => {
    // Replace spaces with dashes and trim any trailing dashes
    const sanitizedUsername = siswa.username
        .replace(/\s+/g, '-')       // Replace spaces with dashes
        .replace(/-+$/, '');        // Remove trailing dashes
    // Construct the URL
    const url = `${siswa.noIndukSiswa}-${sanitizedUsername}`;
    router.push(`/siswa/${url}`);
};
    useEffect(() => {
        const fetchSiswaData = async () => {
            try {
                const response = await fetch("/api/siswa");
                const data = await response.json();

                if (data.error) throw new Error(data.error);

                setSiswaList(data);
                setFilteredSiswaList(data);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSiswaData();
    }, []);

    useEffect(() => {
        const defaultSortedData = siswaList.sort(
            (a, b) => a.nomor_absen - b.nomor_absen
        );

        const filteredData = defaultSortedData
            .filter((siswa) =>
                siswa.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter((siswa) =>
                filterGender ? siswa.gender === parseInt(filterGender) : true
            );

        setFilteredSiswaList(filteredData);
        setCurrentPage(1);
    }, [searchTerm, filterGender, siswaList]);

    const totalPages = Math.ceil(filteredSiswaList.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSiswaList.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1) {
            setCurrentPage(totalPages);
        } else if (pageNumber > totalPages) {
            setCurrentPage(1);
        } else {
            setCurrentPage(pageNumber);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <div
                className={`absolute top-16 z-[-2] h-screen w-screen ${
                    theme === "light"
                        ? "absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
                        : ""
                }`}
            >
                <main className="mx-auto container p-6 space-y-6  text-gray-800 dark:text-gray-100 pb-32">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
                        Daftar Siswa
                    </h1>

                    <div className="mb-6 flex flex-col items-center sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
                        <Input
                            type="text"
                            placeholder="Cari berdasarkan username..."
                            className="p-2 max-w-sm w-full border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <select
                            className="p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                            value={filterGender}
                            onChange={(e) => setFilterGender(e.target.value)}
                        >
                            <option value="">Semua Jenis Kelamin</option>
                            <option value="1">Laki Laki</option>
                            <option value="0">Perempuan</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
                        <Suspense fallback={<SkeletonCard />}>
                            {loading
                                ? Array.from({ length: itemsPerPage }).map(
                                      (_, index) => <SkeletonCard key={index} />
                                  )
                                : currentItems.map((siswa) => (
                                      <Card
                                          key={siswa.id}
                                          className={`relative p-6 shadow-xl rounded-lg overflow-hidden text-gray-900 dark:text-gray-100 ${
                                              siswa.gender === 1
                                                  ? "border-l-4 dark:border-l-2 border-blue-500 dark:border-blue-400"
                                                  : "border-l-4 dark:border-l-2 border-pink-500 dark:border-pink-400"
                                          } bg-card dark:bg-card`}
                                      >
                                          <div className="absolute top-0 left-0 w-full h-32 overflow-hidden">
                                              <img
                                                  src={
                                                      siswa.banner_url ||
                                                      "/banner.jpg"
                                                  }
                                                  alt="Background"
                                                  className="object-cover w-full h-full "
                                              />
                                          </div>
                                          <div className="relative mx-auto w-32 h-32 mt-4  rounded-full overflow-hidden">
                                              <img
                                                  src={
                                                      siswa.profile_picture_url ||
                                                      "/default.webp"
                                                  }
                                                  alt={siswa.username}
                                                  className="object-cover w-full h-full"
                                              />
                                          </div>
                                          <div className="relative text-center mt-20">
                                              <h2 className="font-semibold text-lg">
                                                  {siswa.username}
                                              </h2>
                                              <p className="text-gray-500 dark:text-card-foreground">
                                                  Freelance Web Designer
                                              </p>
                                          </div>
                                          <CardContent className="relative text-center mt-4">
                                              <p className="text-sm text-card-foreground dark:text-card-foreground mb-4">
                                                  Gender:{" "}
                                                  {siswa.gender === 1
                                                      ? "Laki Laki"
                                                      : "Perempuan"}
                                              </p>
                                              <div className="text-sm ">
                                                  <Badge
                                                      variant="outline"
                                                      className={`text-sm ${
                                                          siswa.gender === 1
                                                              ? "text-blue-600 dark:text-blue-400"
                                                              : "text-pink-600 dark:text-pink-400"
                                                      }`}
                                                  >
                                                      #{siswa.nomor_absen}
                                                  </Badge>
                                              </div>
                                          </CardContent>

                                          <CardFooter className="relative flex justify-center mt-4">
                                              <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className=""
                                                  onClick={() =>
                                                      handleDetailClick(siswa)
                                                  }
                                              >
                                                  Lihat Detail
                                              </Button>
                                          </CardFooter>
                                      </Card>
                                  ))}
                        </Suspense>
                    </div>

                    <Pagination>
                        <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Prev
                        </PaginationPrevious>
                        <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </PaginationNext>
                    </Pagination>
                </main>
            </div>
        </>
    );
};

export default PageSiswa;
