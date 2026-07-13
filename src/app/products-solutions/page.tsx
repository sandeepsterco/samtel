import PaginationWrapper from "@/components/common/pagination/PaginationWrapper";
import NoData from "@/components/ui/NoData";
import { apiFetch } from "@/lib/api"
import { getSlug } from "@/lib/getSlug";
import Image from "next/image";
import Link from "next/link";

interface ProductDataInterface {
    name: string;
    image?: string;
    ['product-category']: string;
    slug: string;
    id: string;
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
    const slug = await getSlug();
    const currentPage = Number(page) || 1;

    const { data: ProductCategoriesData, error: ProductError } = await apiFetch(`product-categories`);
    const productCategories = (ProductCategoriesData as CategoryInterface)?.data ?? [];

    const activeType = type || productCategories[0]?.slug;

    const [{ data, error }] = await Promise.all([apiFetch(`product/${activeType}?page=${currentPage}`)])

    const apiData = (data as ProductsDataInterface)?.products;

    const productsData = apiData?.data ?? [];

    return (
        <section className="products_systems_detail">
            <div className="container">
                <div className="row">
                    <div className="col-lg-2"></div>
                    {data?.category && (
                        <div className="col-lg-10">
                            <h3>{data?.category?.name}</h3>
                        </div>
                    )}
                    


                    <div className="col-lg-2">
                        <div className="prodcut-nav">
                            <ul>
                                {productCategories?.map((item, idx) => (
                                    <li key={idx} className={activeType === item.slug ? 'active' : ''}>
                                        <Link href={`${slug}?type=${item.slug}`}>{item.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>


                    <div className="col-lg-10 mx-auto">
                        {productsData.length > 0 ? (
                            <>
                                <div className="product_grid">
                                    {productsData.map((item) => (
                                        <div key={item.id} className="product_item">
                                            <figure>
                                                <Image src={item.image ?? "/assets/images/placeholders/product.webp"} className="img-fluid" width={275} height={265} alt={item.name} loading="lazy" />
                                            </figure>
                                            {item?.name && (
                                                <p>{item.name}</p>
                                            )}
                                        </div>
                                    ))}

                                </div>

                                {productsData?.length > 0 && (
                                    <PaginationWrapper
                                        currentPage={apiData?.current_page || 1}
                                        totalPages={apiData?.last_page || 1}
                                    />
                                )}
                            </>
                        ) : <NoData />}
                        

                    </div>
                </div>
            </div>



        </section>
    )
}