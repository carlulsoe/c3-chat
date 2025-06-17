import type { NextConfig } from "next";
import withPWA from "next-pwa";

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

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})(nextConfig);
