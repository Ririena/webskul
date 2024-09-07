import { supabase } from "@/lib/supabase";

export async function generateMetadata({ params }) {
  const { detailsiswa } = params;

  const [noIndukSiswa, ...namaSiswaParts] = detailsiswa.split("-");
  const namaSiswa = namaSiswaParts.join("-");

  const { data: siswa, error: siswaError } = await supabase
    .from("user")
    .select("username, bio")
    .eq("noIndukSiswa", noIndukSiswa)
    .single();

  if (siswaError || !siswa) {
    return {
      title: "Student Not Found",
      description: "The requested student profile could not be found.",
      alternates: {
        canonical: "/not-found",
      },
      robots: "noindex, nofollow",
    };
  }

  const baseUrl = new URL("https://xipplg2-7.vercel.app");
  const canonicalUrl = `https://xipplg2-7.vercel.app/siswa/${noIndukSiswa}-${encodeURIComponent(namaSiswa)}`;

  return {
    metadataBase: baseUrl,
    title: `${siswa.username} - XI RPL 2`,
    description: `Lihat profil ${siswa.username}. Temukan informasi mengenai minat, latar belakang, dan pencapaian mereka.`,
    keywords: `${siswa.username}, Kelas XI RPL 2, profil siswa, ${siswa.bio || "siswa"}`,
    author: siswa.username,
    robots: "index, follow",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${siswa.username} - XI RPL 2`,
      description: `Lihat profil ${siswa.username}. Temukan informasi mengenai minat, latar belakang, dan pencapaian mereka.`,
      url: canonicalUrl,
      images: `${baseUrl}/og-image.png`,
    },
  };
}

export default function Layout({ children }) {
  return <section>{children}</section>;
}
