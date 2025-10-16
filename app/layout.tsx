import type { Metadata } from "next";
import { Quicksand, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { Analytics } from "@vercel/analytics/next";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KiddyGoo – Parent App",
    template: "%s | KiddyGoo Parent App",
  },
  description:
    "KiddyGoo Parent App membantu orang tua memantau lokasi anak secara real-time, mengatur zona aman, dan menjaga keamanan keluarga dengan teknologi modern berbasis AI & GPS.",
  keywords: [
    "KiddyGoo",
    "Parent App",
    "Kids Tracker",
    "Child Monitoring",
    "Geofencing",
    "Supabase",
    "Next.js",
    "Real-time GPS",
    "Family Safety",
  ],
  authors: [{ name: "KiddyGoo Team" }],
  creator: "KiddyGoo",
  publisher: "KiddyGoo",
  metadataBase: new URL("https://kiddygoo.my.id"),
  openGraph: {
    title: "KiddyGoo – Parent App",
    description:
      "Pantau dan lindungi anak Anda dengan KiddyGoo Parent App, sistem pelacakan lokasi real-time dan zona aman berbasis teknologi AI & GPS.",
    url: "https://kiddygoo.my.id",
    siteName: "KiddyGoo",
    images: [
      {
        url: "/logo/KiddyGo-Logo.png",
        width: 1200,
        height: 630,
        alt: "KiddyGoo Parent Dashboard Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KiddyGoo – Parent App",
    description:
      "Pantau lokasi anak secara real-time dan buat zona aman langsung dari dashboard KiddyGoo Parent App.",
    images: ["/logo/KiddyGo-Logo.png"],
    creator: "@kiddygooapp",
  },
  icons: {
    icon: "/logo/KiddyGo-Logo.svg",
    shortcut: "/logo/KiddyGo-Logo.svg",
    apple: "/logo/KiddyGo-Logo.svg",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quicksand.variable} ${inter.variable} antialiased font-body`}
      >
        <SupabaseProvider initialSession={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
          <Analytics />
        </SupabaseProvider>
      </body>
    </html>
  );
}
