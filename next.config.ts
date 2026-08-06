import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/suns-echo",
  assetPrefix: "/suns-echo",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
