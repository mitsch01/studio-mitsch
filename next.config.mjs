/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "pub-dfcf020ca5ff4b9a957e138d4326bb45.r2.dev",
      },
    ],
  },
};

export default nextConfig;
