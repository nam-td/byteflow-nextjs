/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
  },
  images: {
    domains: ['localhost']
  },
  async rewrites() {
    return [
        {
            source: '/api/:slug*',
            destination: `${process.env.API_URL}/:slug*`
        },
        {
          source: '/api/:slug*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:slug*`
      }
    ]
},
}

module.exports = nextConfig
