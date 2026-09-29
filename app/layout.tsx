import type { Metadata } from "next";
import { edition } from "@/data/edition";
import "./globals.css";

const title = `${edition.title} | Suns Media Day 2026 | The Echo`;
const description = "Phoenix Suns Media Day in ownership perspective: where the principals align, how preparation is being described, and the words carrying through sampled media coverage and fan reaction.";
const siteUrl = "https://meltckr.github.io";
const canonical = `${edition.basePath}/`;
const shareImage = `${edition.basePath}/og-media-day-2026-09-28-v3.png`;
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), title, description, applicationName: "The Echo",
  authors: [{ name: "Accelerated Velocity Consulting" }],
  robots: { index: false, follow: false },
  alternates: { canonical }, icons: { icon: `${edition.basePath}/favicon.svg` },
  openGraph: { title, description, type: "article", url: canonical,
    siteName: "The Echo · Phoenix Suns Ownership Intelligence",
    images: [{ url: shareImage, width: 1200, height: 630, alt: "In the Same Building: Phoenix Suns Media Day, September 28, 2026. Official Phoenix Suns photographs arranged in Blender." }] },
  twitter: { card: "summary_large_image", title, description, images: [shareImage] }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
