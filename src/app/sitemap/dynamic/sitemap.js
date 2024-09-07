// /app/sitemap/dynamic/getDynamicSitemap.ts
import { supabase } from "@/lib/supabase"

export default async function sitemap() {
  try {
    const { data: siswaList, error: siswaError } = await supabase
      .from("siswa")
      .select("noIndukSiswa")

    if (siswaError) {
      console.error("Error fetching siswa data:", siswaError.message)
      return [] // Return an empty array in case of error
    }

    const userPromises = siswaList.map(async siswa => {
      const { data: users, error: userError } = await supabase
        .from("user")
        .select("username")
        .eq("noIndukSiswa", siswa.noIndukSiswa)

      if (userError) {
        console.error(
          `Error fetching user data for ${siswa.noIndukSiswa}:`,
          userError.message
        )
        return { noIndukSiswa: siswa.noIndukSiswa, username: "Unknown" }
      }

      const username = users.length > 0 ? users[0].username : "Unknown"
      return { noIndukSiswa: siswa.noIndukSiswa, username }
    })

    const siswaDataWithUsernames = await Promise.all(userPromises)

    return siswaDataWithUsernames.map(({ noIndukSiswa, username }) => {
      const sanitizedUsername = username.replace(/\s+/g, "-").replace(/-+$/, "")

      return {
        url: `https://xipplg2-7.vercel.app/siswa/${noIndukSiswa}-${encodeURIComponent(
          sanitizedUsername
        )}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "monthly",
        priority: 0.7
      }
    })
  } catch (e) {
    console.error("Unexpected error:", e.message)
    return []
  }
}
