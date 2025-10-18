import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(self), microphone=(self), geolocation=(self), notifications=(self), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: blob:
        https://lh3.googleusercontent.com
        https://avatars.githubusercontent.com
        https://api.dicebear.com
        https://ltarjljnzwrogwwdvtob.supabase.co
        https://platform-lookaside.fbsbx.com
        https://a.tile.openstreetmap.org
        https://b.tile.openstreetmap.org
        https://c.tile.openstreetmap.org
        https://cdn-icons-png.flaticon.com;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self'
        https://ai.kiddygoo.my.id
        https://*.supabase.co
        https://kiddygoo.my.id
        https://nominatim.openstreetmap.org
        wss://*.supabase.co;
      frame-ancestors 'none';
      base-uri 'self';
    `.replace(/\n/g, ""),
  },
];

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "api.dicebear.com",
      "ltarjljnzwrogwwdvtob.supabase.co",
      "platform-lookaside.fbsbx.com",
      "a.tile.openstreetmap.org",
      "b.tile.openstreetmap.org",
      "c.tile.openstreetmap.org",
      "cdn-icons-png.flaticon.com",
    ],
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  trailingSlash: true,
  productionBrowserSourceMaps: true,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
