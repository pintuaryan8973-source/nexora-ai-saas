import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nexora AI — Intelligent work, automated",
    template: "%s | Nexora AI",
  },
  description: "Nexora AI connects company knowledge, AI agents, and automation so modern teams can move faster with less repetitive work.",
  keywords: ["Nexora AI", "AI SaaS", "AI agents", "workflow automation", "knowledge workspace"],
  authors: [{ name: "Nexora AI" }],
  creator: "Nexora AI",
  applicationName: "Nexora AI",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Nexora AI — Intelligent work, automated",
    description: "Connect knowledge, automate repetitive work, and give every team an AI copilot that understands what matters.",
    siteName: "Nexora AI",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Nexora AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora AI — Intelligent work, automated",
    description: "Connect knowledge, automate repetitive work, and give every team an AI copilot that understands what matters.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05050a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geist.variable} ${geistMono.variable} bg-[#05050a] antialiased`}>
        {children}
      </body>
    </html>
  );
}
