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
  },
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
         {
          key: 'X-Accel-Buffering',
          value: 'no',
         },
       ],
     },
   ]
 },
};

export default nextConfig;
