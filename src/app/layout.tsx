import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  variable: "--nf-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--nf-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--nf-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fiorisce | Premium Florist & Floral Arrangements",
    template: "%s | Fiorisce",
  },
  description:
    "Where Every Bloom Tells a Story. Discover premium, handcrafted floral arrangements for weddings, events, and everyday gifting.",
  keywords: [
    "florist",
    "flowers",
    "floral arrangements",
    "boutique florist",
    "flower delivery",
    "premium flowers",
    "Fiorisce",
  ],
  authors: [{ name: "Fiorisce" }],
  creator: "Fiorisce",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Fiorisce | Premium Florist",
    description:
      "Where Every Bloom Tells a Story. Discover premium, handcrafted floral arrangements.",
    siteName: "Fiorisce",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiorisce | Premium Florist",
    description:
      "Where Every Bloom Tells a Story. Discover premium, handcrafted floral arrangements.",
  },
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

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/elements/Navbar";
import { Footer } from "@/components/elements/Footer";
import { ThemeProvider } from "@/context/theme-provider";
import { SessionProvider } from "@/context/session-provider";
import { CartProvider } from "@/context/cart-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="font-inter bg-cornsilk-100 dark:text-cornsilk-100 flex min-h-full flex-col text-neutral-900 dark:bg-neutral-950"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <CartProvider>
              <TooltipProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </TooltipProvider>
              <Toaster />
            </CartProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
