import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/proxy-image',
        search: '**',
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "platform-outputs.agnes-ai.space",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
