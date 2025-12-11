// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],                    // để trống
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",             // <<<< DẤU SAO KÉP = CHO PHÉP TẤT CẢ
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",             // nếu bạn cần cả http (localhost, một số hosting cũ)
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;