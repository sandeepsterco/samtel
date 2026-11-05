import BlogsListing from "@/components/blogs/BlogsListing";
import { getPageSEO } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getPageSEO("blogs");

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        alternates: seo.alternates,
        robots: seo.robots,
        openGraph: seo.openGraph
            ? {
                  ...seo.openGraph,
              }
            : undefined,
    };
}

export default function BlogsPage() {
    return <BlogsListing page={1} />;
}
