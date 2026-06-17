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
  title: "Fiorisce",
  description: "Where Every Bloom Tells a Story",
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
