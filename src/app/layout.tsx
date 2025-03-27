import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Artwork - Preserving Indian Art & Craft Heritage",
  description:
    "A digital platform connecting artisans with global markets and preserving cultural heritage",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
