import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  webpack: (config, { isServer, dev }) => {
    // Only apply this fix for client-side production builds
    if (!isServer && !dev) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false, // This tells webpack to provide an empty module
        net: false,
        _http_common: false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
    ],
  },
};

export default nextConfig;
