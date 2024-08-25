import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/lib/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "XI RPL 2 SMKN 7 BALEENDAH",
    description: "Website Kelas XI RPL 2 SMKN 7 BALEENDAH",
    keywords: ['SMKN 7 BALEENDAH', 'XI RPL 2', 'Website', "Web Kelas", "Web Apps"],
    verification: {
        google: "3YiNQkygrshbd6IQGjPpI4KSa8vEejaJbeKzqWaWQ2c",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <section>{children}</section>
                </Providers>
            </body>
        </html>
    );
}
