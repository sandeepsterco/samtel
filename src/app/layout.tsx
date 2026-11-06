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
  metadataBase: new URL("https://samtelavionics.com"),

  title: {
    default: "Samtel Avionics | Defence Electronics Company in India",
    template: "%s | Samtel Avionics",
  },

  description:
    "Samtel Avionics (SA) is a key Indian player in high-technology avionics, defence and railway electronic products and systems.",

  verification: {
    google: "5F1J4u7wctCD5Kzl3AJ0dOVJ12mfZUPxZL7EBvdfz3c",
  },

  openGraph: {
    siteName: "Samtel Avionics",
    type: "website",
    title: "Defence Electronics Company in India",
    description:
      "Samtel Avionics (SA) is a key Indian player in high-technology avionics, defence and railway electronic products and systems.",
    url: "/",
    images: [
      {
        url: "/assets/images/main-logo.webp",
        alt: "Samtel Avionics",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Defence Electronics Company in India",
    description:
      "Samtel Avionics (SA) is a key Indian player in high-technology avionics, defence and railway electronic products and systems.",
    images: ["/assets/images/main-logo.webp"],
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
      <head>
        <meta
            name="google-site-verification"
            content="5F1J4u7wctCD5Kzl3AJ0dOVJ12mfZUPxZL7EBvdfz3c"
        />

        

      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-P5DJ66QV"
        />

        <Script id="google-tag-manager-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GTM-P5DJ66QV');
          `}
        </Script>
        <Script id="reset-scroll-position" strategy="beforeInteractive">
          {`if ("scrollRestoration" in window.history) {
              window.history.scrollRestoration = "manual";
            }
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });`}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RSVP17KFKM"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RSVP17KFKM');
          `}
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
