import Image from "next/image";
import Link from "next/link";
import NoData from "@/components/ui/NoData";
import PaginationWrapper from "@/components/common/pagination/PaginationWrapper";
import { BASE_URL } from "@/config/config";

export interface ListingItem {
    id: number;
    title: string;
    slug: string;
    date?: string | null;
    created_at?: string | null;
    image_url: string;
    category?: { id: number; name: string } | null;
}

export interface ListingPagination {
    current_page: number;
    last_page: number;
}

export interface ListingApiResponse<T extends ListingItem = ListingItem> {
    status: boolean;
    message: string;
    data: T[];
    pagination?: ListingPagination;
}

export function formatDate(value: string | null | undefined): string {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

interface ListingGridProps {
    items: ListingItem[];
    pagination?: ListingPagination;
    basePath: string;
    pageKey?: string;
    paginationBasePath?: string;
    openInNewTab?: boolean;
}

export default function ListingGrid({
    items,
    pagination,
    basePath,
    pageKey = "page",
    paginationBasePath,
    openInNewTab = false,
}: ListingGridProps) {
    if (!items.length) return <NoData />;

    const base = basePath.replace(/\/+$/, "");

    return (
        <>
            <div className="gallery-container">
                {items.map((item) => {
                    const dateText = formatDate(item.date ?? item.created_at);

                    return (
                        <div key={item.id} className="gallery-card">
                            <div className="media-image-wrapper blog_wrapper">
                                <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    width={376}
                                    height={211}
                                    loading="lazy"
                                />
                                {item.category?.name && (
                                    <div className="media-badge">{item.category.name}</div>
                                )}
                            </div>

                            <div className="media-content">
                                <h3 className="media-title">{item.title}</h3>
                                {dateText && <div className="date">{dateText}</div>}
                                <div className="read-icon">
                                    <img src="/assets/icons/read-icon.svg" alt="read" />
                                </div>
                            </div>

                            <Link
                                className="streched_link"
                                href={`${BASE_URL}blogs/${item.slug}`}
                                aria-label={item.title}
                            />
                        </div>
                    );
                })}
            </div>

            <PaginationWrapper
                currentPage={pagination?.current_page || 1}
                totalPages={pagination?.last_page || 1}
                pageKey={pageKey}
                basePath={paginationBasePath}
            />
        </>
    );
}