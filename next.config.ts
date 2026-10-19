import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edu.biddaneer.com",
      },
      {
        protocol: "https",
        hostname: "pub-a48faf8501344fa7bc8b1f49d299a108.r2.dev",
      },
      {
        protocol: "https",
        hostname: "bucket.biddaneer.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
