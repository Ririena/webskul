import { supabase } from "@/lib/supabase";

export async function generateMetadata({ params }) {
  const { detailsiswa } = params;

  // Pisahkan noIndukSiswa dan namaSiswa
  const [noIndukSiswa, ...namaSiswaParts] = detailsiswa.split("-");
  const namaSiswa = namaSiswaParts.join("-");

  // Fetch siswa data based on the noIndukSiswa
  const { data: siswa, error: siswaError } = await supabase
    .from("user")
    .select("*")
    .eq("noIndukSiswa", noIndukSiswa)
    .single();

  if (siswaError || !siswa) {
    return {
      title: "Student Not Found",
      description: "The requested student profile could not be found.",
    };
  }

  return {
    title: `${siswa.username} - XI RPL 2`,
    description: `Lihat profil ${siswa.username} Temukan informasi mengenai minat, latar belakang, dan pencapaian mereka.`,
    keywords: `${siswa.username}, Kelas XI RPL 2, profil siswa, Dengan Bio: ${siswa.bio || "siswa"}`,
    author: siswa.username,
    robots: "index, follow",
  };
}

export default function Layout({ children }) {
  return <section>{children}</section>;
}
