import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {}, // ✅ Fix: Change from true → {}
  },
  transpilePackages: ["mongoose"], // ✅ Use this instead of serverComponentsExternalPackages
};

export default nextConfig;
