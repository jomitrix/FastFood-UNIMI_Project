/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '7777',
                pathname: '/api/uploads/**',
            },
        ]
    },
};

module.exports = nextConfig;
