import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PopArt.ee - Custom Digital Painting Portraits",
  description: "Turn your photos into stunning digital art portraits. Unique backgrounds, high-quality canvas prints, and fast delivery. Professional AI-powered art editor.",
  keywords: ["popart", "digital painting", "custom portrait", "canvas print", "gift idea", "photo to art"],
  openGraph: {
    title: "PopArt.ee - Your Photos, Pure Art",
    description: "Create stunning digital painting portraits from your photos in seconds.",
    url: "https://popart.ee",
    siteName: "PopArt.ee",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PopArt.ee - Custom Digital Painting Portraits",
    description: "Turn your photos into stunning digital art portraits.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
