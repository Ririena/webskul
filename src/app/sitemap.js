// sitemap.js
import { supabase } from "@/lib/supabase";

export default async function sitemap() {
  // Fetch all siswa data to generate dynamic URLs
  const { data: siswaList, error } = await supabase
    .from("siswa")
    .select("noIndukSiswa");

  if (error) {
    console.error("Error fetching siswa data:", error.message);
    return [
      {
        url: "https://xipplg2-7.vercel.app/",
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },
      {
        url: 'https://xipplg2-7.vercel.app/siswa',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ];
  }

  // Generate sitemap entries for each siswa
  const siswaUrls = siswaList.map(siswa => ({
    url: `https://xipplg2-7.vercel.app/siswa/${siswa.noIndukSiswa}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Return the full sitemap
  return [
    {
      url: "https://xipplg2-7.vercel.app/",
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://xipplg2-7.vercel.app/siswa',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...siswaUrls,
  ];
}
