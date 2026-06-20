import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabled because React 19 StrictMode double-mounts effects, which causes
  // R3F to create two WebGL contexts and the first one is lost (white canvas).
  reactStrictMode: false,
};

export default nextConfig;
