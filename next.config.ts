import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'api.dicebear.com', 'ltarjljnzwrogwwdvtob.supabase.co', 'platform-lookaside.fbsbx.com'],
  },
  // For DeploymentConfig
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  productionBrowserSourceMaps: true,
};

export default nextConfig;
