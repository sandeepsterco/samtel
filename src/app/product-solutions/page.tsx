import ProductSolutionsClient from "@/components/product-solutions/ProductSolutionsClient";
import { apiFetch } from "@/lib/api"

interface ProductDataInterface {
    name: string;
    image?: string;
    ['product-category']: string;
    slug: string;
    id: string;
    description?: string;
    details?: string;
    content?: string;
    product_details?: string;
    product_details_html?: string;
}

interface ProductsDataInterface {
    products: {
        current_page: number;
        data: ProductDataInterface[];
        last_page: number;
    },
}

interface ProductCategoryInterface {
    name: string;
    slug: string;
}

interface CategoryInterface {
    data: ProductCategoryInterface[];
}

export default async function ProductListingPage({ searchParams }: { searchParams: Promise<{ page?: string; type?:string }> }) {
    const { page, type } = await searchParams;
    const currentPage = Number(page) || 1;

    const { data: ProductCategoriesData } = await apiFetch(`product-categories`);
    const productCategories = (ProductCategoriesData as CategoryInterface)?.data ?? [];

    const activeType = productCategories.some((category) => category.slug === type)
        ? type
        : productCategories[0]?.slug;

    const { data } = activeType
        ? await apiFetch(`product/${encodeURIComponent(activeType)}?page=${currentPage}`)
        : { data: null };

    const apiData = (data as ProductsDataInterface)?.products;
    const productsData = apiData?.data ?? [];

    return <ProductSolutionsClient
        categories={productCategories}
        activeCategory={productCategories.find((category) => category.slug === activeType)}
        products={productsData}
        currentPage={apiData?.current_page || 1}
        totalPages={apiData?.last_page || 1}
    />;
}