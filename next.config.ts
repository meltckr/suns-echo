import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_ECHO_BASE_PATH ?? "/suns-echo";
const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
