import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.annebealaspa.com.ng" }],
        destination: "https://annebealaspa.com.ng/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
