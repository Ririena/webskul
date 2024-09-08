import Navigation from "@/layout/Navigation";

const canonicalUrl = 'https://xipplg2-7.vercel.app/siswa'

export const metadata = {
    title: "Daftar Siswa",
    description: "List Daftar Siswa RPL/PPLG Yang Berada Di SMKN 7 BALEENDAH",
    keywords: ['SMKN 7 BALEENDAH', 'Daftar Siswa', 'XI RPL 2', 'XI PPLG 2', 'Web Kelas', 'Sekolah'],
    openGraph: {
        title: "Daftar Siswa",
        description: "List Daftar Siswa Yang Berada Di SMKN 7 BALEENDAH",
        url: "https://xipplg2-7.vercel.app/siswa",
        siteName: "Daftar Siswa XI PPLG 2 SMKN 7"
    },
    alternates: {
        canonical: canonicalUrl,
      },
    robots: "index, follow",
}

const LayoutSiswa = ({ children }) => {
    return (
        <>
            <Navigation />
         
                <main>{children}</main>
        </>
    );
};

export default LayoutSiswa;
