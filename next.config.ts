import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        // 👇 matches all routes except /api
        source: "/((?!api/).*)",
        destination: "/static-app-shell",
      },
    ];
  },
};

export default nextConfig;
