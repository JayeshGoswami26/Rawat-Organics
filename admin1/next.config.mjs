/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['vm-7j8tf34smbf9drtzo5mdffyf.vusercontent.net'],
}

export default nextConfig
