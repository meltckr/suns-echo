import type { Metadata } from "next";
import "./globals.css";

const title = "THE ECHO: Aligned and Extended | Phoenix Suns Ownership Intelligence";
const description = "A verified ownership read on how Dillon Brooks’ three-year, $73 million Phoenix Suns extension landed across basketball.";

export const metadata: Metadata = {
  metadataBase: new URL("https://meltckr.github.io"),
  title,
  description,
  icons: { icon: "/suns-echo/favicon.svg" },
  openGraph: {
    title,
    description,
    type: "article",
    images: [{ url: "/suns-echo/og-image.png", width: 1200, height: 630, alt: "THE ECHO: Aligned and Extended — Dillon Brooks" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/suns-echo/og-image.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
