import type { Metadata } from "next";
import { Funnel_Sans } from "next/font/google";
import Header from "@/components/header/Header";
import WipeOnScroll from "@/components/common/WipeOnScroll";
import RouteBodyClass from "@/components/common/RouteBodyClass";
import PageTransitionLoader from "@/components/common/PageTransitionLoader";

import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import Footer from "@/components/footer/Footer";
import Script from "next/script";
import ScrollToTop from "@/components/common/ScrollToTop";
import '../styles/globals.css'
import Providers from "@/lib/Providers";
import AosProvider from "@/components/AosProvider";

const funnelSans = Funnel_Sans({
  subsets: ['latin'],
  variable: '--font-funnel'
})

export const metadata: Metadata = {
  title: {
    default: "Samtel Group",
    template: "%s | Samtel Group",
  },
  description:
    "Learn about Samtel Group, its products, technology, people, and latest updates.",
  openGraph: {
    siteName: "Samtel Group",
    type: "website",
    title: "Samtel Group",
    description:
      "Learn about Samtel Group, its products, technology, people, and latest updates.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samtel Group",
    description:
      "Learn about Samtel Group, its products, technology, people, and latest updates.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${funnelSans.variable} h-full antialiased`}
      // data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="reset-scroll-position" strategy="beforeInteractive">
          {`if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
window.scrollTo({ top: 0, left: 0, behavior: "instant" });`}
        </Script>
        <PageTransitionLoader />
        <ScrollToTop />
        <RouteBodyClass />
        <WipeOnScroll />
        <Providers>
        <AosProvider />
        <Header />
        {children}
        <Footer />
        <Script src="/js/smoothscroll.min.js" strategy="lazyOnload" />
        </Providers>
      </body>
    </html>
  );
}
