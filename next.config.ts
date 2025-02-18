import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: true,
  },
  mdxRs: true, 
  serverComponentsExternalPackages: ["mongoose"], 
};

export default nextConfig;