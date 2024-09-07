import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET({ params }) {
  const { noIndukSiswa } = params

  try {
    // Fetch user data for the specific noIndukSiswa
    const { data: users, error: userError } = await supabase
      .from("user")
      .select("username")
      .eq("noIndukSiswa", noIndukSiswa)

    if (userError) {
      console.error(
        `Error fetching user data for ${noIndukSiswa}:`,
        userError.message
      )
      return new Response(
        "<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'></urlset>",
        {
          status: 200,
          headers: { "Content-Type": "text/xml" }
        }
      )
    }

    const username = users.length > 0 ? users[0].username : "Unknown"

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${`https://xipplg2-7.vercel.app/siswa/${noIndukSiswa}-${encodeURIComponent(
      username
    )}`}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`

    return new Response(xml, {
      status: 200,
      headers: { "Content-Type": "text/xml" }
    })
  } catch (e) {
    console.error("Unexpected error:", e.message)
    return new Response(
      "<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'></urlset>",
      {
        status: 200,
        headers: { "Content-Type": "text/xml" }
      }
    )
  }
}
