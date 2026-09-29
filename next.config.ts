import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "http://18.234.248.67:5000/:path*",
      },
    ];
  },
};

export default nextConfig;
