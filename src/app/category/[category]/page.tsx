import CategoryProducts from "@/components/category/CategoryProducts";
import ReactParserDynamic from "@/components/common/reactParser/ReactParserDynamic";
import { apiFetch } from "@/lib/api";

export default async function CategoryInnerPage({ params, searchParams }: { params: Promise<{ category: string }>; searchParams:Promise<{ page?: string;}> }) {
    const { category } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;

    const { data, error } = await apiFetch(`product-category/${category}?page=${currentPage}`);

    const combinedHtml = Object.values(data?.data?.productCategory?.cms ?? {}).join('');

    const productsData = data?.data?.products ?? {};

    return (
        <>
            <ReactParserDynamic html={combinedHtml} />
            <CategoryProducts data={productsData} title={data?.data?.page_title} />
        </>
    )
}