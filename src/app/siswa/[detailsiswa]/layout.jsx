import { supabase } from "@/lib/supabase";

const BASE_URL = "https://xipplg2-7.vercel.app";

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
        canonical: `${BASE_URL}/not-found`,
      },
      robots: "index, follow",
    };
  }

  const canonicalUrl = `${BASE_URL}/siswa/${noIndukSiswa}-${encodeURIComponent(namaSiswa)}`;

  return {
    metadataBase: new URL(BASE_URL),
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

    },
  };
}

export default function Layout({ children }) {
  return <section>{children}</section>;
}
