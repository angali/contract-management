/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    APP_NAME: 'Contract Management Dashboard',
    BACKEND_API_URL: process.env.BACKEND_API_URL ||'http://localhost:8000/api',
    PRODUCTION: process.env.PRODUCTION ||false,
    DOMAIN: 'http://localhost:3000',
  },
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  }, 
}

module.exports = nextConfig
