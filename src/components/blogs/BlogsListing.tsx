import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { BASE_URL } from "@/config/config";
import ListingGrid, { ListingApiResponse } from "@/components/blogs/BlogListingGrid";

export default async function BlogsListing({ page }: { page: number }) {
    const { data } = await apiFetch(`blogs?page=${page}`);
    const res = data as ListingApiResponse;
    const items = res?.data ?? [];

    if (page > 1 && items.length === 0) notFound();

    return (
        <section className="gallery">
            <div className="container">
                <div className="col-lg-11 mx-auto">
                    <ListingGrid
                        items={items}
                        pagination={res?.pagination}
                        basePath={`${BASE_URL}blogs`}  
                        paginationBasePath="/blogs"  
                        openInNewTab
                    />
                </div>
            </div>
        </section>
    );
}