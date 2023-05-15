/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dish-form",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["https://new-dish-form-rho.vercel.app/dish-form"],
  },
};

module.exports = nextConfig;
