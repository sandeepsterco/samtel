import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {protocol:"https", hostname:"**"},
      {protocol:"http", hostname:"**"}
    ],
    // unoptimized:true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // X-Frame-Options removed — frame-ancestors in CSP handles this now
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://project-demo.in/samtel/api/:path*",
      },
    ];
  },
};

export default nextConfig;
