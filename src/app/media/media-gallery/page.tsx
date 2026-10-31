import { apiFetch } from "@/lib/api";
import NoData from "@/components/ui/NoData";
import PaginationWrapper from "@/components/common/pagination/PaginationWrapper";
import GalleryClient, { GalleryItem } from "@/components/gallery/GalleryClient";
import { getPageSEO } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getPageSEO("media/media-gallery");

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

interface GalleryMediaItem {
    upload_media: string | null;
    iframe_url: string | null;
}

interface GalleryApiItem {
    title: string;
    date: string;
    mapping_items: {
        gallery: GalleryMediaItem[];
    };
    slug: string;
    id: number;
    images: number;
    videos: number;
}

interface GalleryDataInterface {
    current_page: number;
    data: GalleryApiItem[];
    last_page: number;
}

interface GalleryApiInterface {
    status: boolean;
    data: GalleryDataInterface;
}

function formatDate (value:string | null | undefined):string{
    if(!value) return '';

    const date = new Date(value);
    if(isNaN(date.getTime())) return '';

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

}

function mapToGalleryItem(item: GalleryApiItem): GalleryItem {
    const media = (item.mapping_items?.gallery ?? [])
        .map((m) => m.upload_media || m.iframe_url)
        .filter((url): url is string => Boolean(url));

    return {
        id: item.id,
        title: item.title,
        date: formatDate(item.date),
        badge: `${item.images} Photo${item.images !== 1 ? "s" : ""} &nbsp;|&nbsp; ${item.videos} Video${item.videos !== 1 ? "s" : ""}`,
        media: media.length > 0 ? media : ["/assets/images/placeholders/product.webp"],
        description: item.title,
    };
}

export default async function GalleryPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;

    const { data } = await apiFetch(`gallery?page=${currentPage}`);
    const apiData = (data as GalleryApiInterface)?.data;
    const rawItems = apiData?.data ?? [];

    const galleryItems: GalleryItem[] = rawItems.map(mapToGalleryItem);

    return (
        <section className="gallery">
            <div className="container">
                <div className="col-lg-11 mx-auto">
                    {galleryItems.length > 0 ? (
                        <>
                            <GalleryClient items={galleryItems} />
                            <PaginationWrapper
                                currentPage={apiData?.current_page || 1}
                                totalPages={apiData?.last_page || 1}
                            />
                        </>
                    ) : (
                        <NoData />
                    )}
                </div>
            </div>
        </section>
    );
}