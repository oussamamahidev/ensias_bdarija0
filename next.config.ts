import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {}, // ✅ Fix: Change from true → {}
  },

  images:{
    remotePatterns:[
      {
        protocol: "https",
        hostname:'*'
      },
      {
        protocol: "http",
        hostname:'*'
      }
    ]
  }
};

export default nextConfig;
