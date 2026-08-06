import type { Metadata } from "next";
import "./globals.css";

const title = "Aligned & Extended: Dillon Brooks’ Three-Year Suns Commitment | The Echo";
const description = "A verified ownership-intelligence read on Dillon Brooks’ three-year, $73 million Phoenix Suns extension, the reaction it generated and why the term matters.";
const siteUrl = "https://suns-echo.netlify.app";
const shareImage = "/suns-echo/og-image-v2.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "The Echo",
  authors: [{ name: "Accelerated Velocity Consulting" }],
  alternates: { canonical: "/" },
  icons: { icon: "/suns-echo/favicon.svg" },
  openGraph: {
    title,
    description,
    type: "article",
    url: "/",
    siteName: "The Echo · Phoenix Suns Ownership Intelligence",
    publishedTime: "2026-08-06T16:30:00-07:00",
    images: [{ url: shareImage, width: 1200, height: 630, alt: "Aligned and Extended — Dillon Brooks, three years and $73 million" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [shareImage] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
