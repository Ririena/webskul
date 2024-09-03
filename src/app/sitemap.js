import { supabase } from "@/lib/supabase";

export default async function sitemap() {
    try {
        // Fetch all siswa data
        const { data: siswaList, error: siswaError } = await supabase
            .from("siswa")
            .select("noIndukSiswa");

        if (siswaError) {
            console.error("Error fetching siswa data:", siswaError.message);
            return getDefaultSitemap(); // Return default sitemap in case of error
        }

        // Fetch user data for each siswa using their noIndukSiswa
        const userPromises = siswaList.map(async (siswa) => {
            const { data: user, error: userError } = await supabase
                .from("user")
                .select("username")
                .eq("noIndukSiswa", siswa.noIndukSiswa)
                .single(); // Assuming each siswa has a single corresponding user entry

            if (userError) {
                console.error(`Error fetching user data for ${siswa.noIndukSiswa}:`, userError.message);
                return { noIndukSiswa: siswa.noIndukSiswa, username: "Unknown" }; // Default to "Unknown" if error
            }

            return { noIndukSiswa: siswa.noIndukSiswa, username: user.username || "Unknown" };
        });

        // Resolve all user data fetches
        const siswaDataWithUsernames = await Promise.all(userPromises);

        // Generate sitemap entries for each siswa
        const siswaUrls = siswaDataWithUsernames.map(({ noIndukSiswa, username }) => {
            // Replace spaces with dashes and remove trailing dashes
            const sanitizedUsername = username
                .replace(/\s+/g, "-")   // Replace spaces with dashes
                .replace(/-+$/, '');    // Remove trailing dashes

            return {
                url: `https://xipplg2-7.vercel.app/siswa/${noIndukSiswa}-${encodeURIComponent(sanitizedUsername)}`,
                lastModified: new Date().toISOString(),
                changeFrequency: "monthly",
                priority: 0.7,
            };
        });

        // Return the full sitemap
        return [
            {
                url: "https://xipplg2-7.vercel.app/",
                lastModified: new Date().toISOString(),
                changeFrequency: "yearly",
                priority: 1,
            },
            {
                url: "https://xipplg2-7.vercel.app/siswa",
                lastModified: new Date().toISOString(),
                changeFrequency: "monthly",
                priority: 0.8,
            },
            ...siswaUrls,
        ];
    } catch (e) {
        console.error("Unexpected error:", e.message);
        return getDefaultSitemap(); // Return default sitemap in case of unexpected errors
    }
}

// Helper function to return a default sitemap
function getDefaultSitemap() {
    return [
        {
            url: "https://xipplg2-7.vercel.app/",
            lastModified: new Date().toISOString(),
            changeFrequency: "yearly",
            priority: 1,
        },
        {
            url: "https://xipplg2-7.vercel.app/siswa",
            lastModified: new Date().toISOString(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];
}
