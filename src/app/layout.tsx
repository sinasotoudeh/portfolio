import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Self-hosted at build time; the size-adjusted fallback (adjustFontFallback, on by default)
// keeps the swap shift-free. Variable names stay distinct from the --font-body / --font-mono
// tokens in globals.css, which reference them. No Inter italic file on purpose (owner call):
// the browser synthesizes the few italic words, saving a 52 KB preload.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

// ایمپورت کامپوننت‌های اختصاصی
import CustomCursor from '@/components/cursor/CustomCursor';
import Navigation from '@/components/navigation/Navigation'; // اضافه شدن ایمپورت منو
import Footer from '@/components/footer/Footer'; // اضافه شدن ایمپورت منو

import LenisProvider from '@/components/providers/LenisProvider'; // مسیر را بر اساس ساختار پروژه خود تنظیم کنید
import { siteUrl } from '@/lib/site';

// Base metadata. Title and description are drafted from the site's own copy (resume role and
// summary) and wait for the owner's sign-off at the Phase 3 gate, together with Open Graph,
// Twitter, canonical and icons.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sina Sotoudeh — Front-End Developer & Technical SEO Engineer",
    template: "%s — Sina Sotoudeh",
  },
  description:
    "Product-minded front-end developer turning UI/UX designs into high-performance, interactive web applications — React, Next.js, TypeScript and technical SEO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <CustomCursor />

        <Navigation />
        <main className="flex-1 flex flex-col">
          <LenisProvider>
            {children}
          </LenisProvider>
        </main>
        <Footer/>
      </body>

    </html>
  );
}
