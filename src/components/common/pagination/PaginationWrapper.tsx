"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "./Pagination";

export default function PaginationWrapper({ currentPage, totalPages, pageKey = "page" }: {
    currentPage: number;
    totalPages: number;
    pageKey?: string; // ← optional, defaults to "page" so all existing usages are unaffected
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();    

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(pageKey, String(page)); // ← uses pageKey instead of hardcoded "page"
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
        />
    )
}