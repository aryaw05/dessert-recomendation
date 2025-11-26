import { Poppins } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Desert Recommendation",
  description:
    "Aplikasi rekomendasi resep dessert berdasarkan bahan yang Anda miliki.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-zinc-50 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
