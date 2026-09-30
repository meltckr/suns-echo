import type { Metadata } from "next";
import { edition } from "@/data/edition";
import "./globals.css";

const title = `${edition.title} | Suns Media Day 2026 | The Echo`;
const description = "Players named who helped them and what they learned. A Suns Media Day review for ownership, with the questions camp needs to answer and a September 29 first-practice update.";
const siteUrl = "https://meltckr.github.io";
const canonical = `${edition.basePath}/`;
const shareImage = `${edition.basePath}/og-media-day-2026-09-28-v4.png`;
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), title, description, applicationName: "The Echo",
  authors: [{ name: "Accelerated Velocity Consulting" }],
  robots: { index: false, follow: false },
  alternates: { canonical }, icons: { icon: `${edition.basePath}/favicon.svg` },
  openGraph: { title, description, type: "article", url: canonical,
    siteName: "The Echo · Phoenix Suns Ownership Intelligence",
    images: [{ url: shareImage, width: 1200, height: 630, alt: "In the Same Building: Phoenix Suns Media Day, September 28, 2026. Players helping players. Official Phoenix Suns photography and Accelerated Velocity Consulting branding." }] },
  twitter: { card: "summary_large_image", title, description, images: [shareImage] }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
