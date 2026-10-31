import Link from "next/link";
import "./thank-you.css";
import { BASE_URL } from "@/config/config";
import { getPageSEO } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("thank-you");

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: seo.alternates,
    robots: {
      ...seo.robots,
      index: false,
      follow: false,
      googleBot: {
        ...seo.robots.googleBot,
        index: false,
        follow: false,
      },
    },
    openGraph: seo.openGraph
      ? {
          ...seo.openGraph,
        }
      : undefined,
  };
}

export default function ThankYouPage() {
  return (
    <main className="thank_you">
      <div className="thank_you_card">
        <h1 className="heading">
          Thank You for Contacting Us!
        </h1>

        <p className="message">
          We have received your inquiry successfully. Our team will get in touch
          with you shortly.
        </p>

        <div>
          <Link
            href={BASE_URL ?? "/"}
            className="back_btn"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}