"use client"
import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "./Pagination";

export default function PaginationWrapper({
    currentPage,
    totalPages,
    pageKey = "page",
    basePath,
}: {
    currentPage: number;
    totalPages: number;
    pageKey?: string;
    basePath?: string;
}) {
    return (
        <Suspense fallback={null}>
            <PaginationContent
                currentPage={currentPage}
                totalPages={totalPages}
                pageKey={pageKey}
                basePath={basePath}
            />
        </Suspense>
    );
}

function PaginationContent({
    currentPage,
    totalPages,
    pageKey = "page",
    basePath,
}: {
    currentPage: number;
    totalPages: number;
    pageKey?: string;
    basePath?: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        if (basePath) {
            const base = basePath.replace(/\/+$/, "");
            router.push(page <= 1 ? base : `${base}/page/${page}`);
            return;
        }

        const params = new URLSearchParams(searchParams.toString());
        params.set(pageKey, String(page));
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
        />
    );
}