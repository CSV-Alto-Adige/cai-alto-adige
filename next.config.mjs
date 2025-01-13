/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'ec2-15-160-218-140.eu-south-1.compute.amazonaws.com'
          },
        ]
      }
};

export default nextConfig;
