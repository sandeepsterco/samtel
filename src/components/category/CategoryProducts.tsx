import Image from "next/image";
import PaginationWrapper from "../common/pagination/PaginationWrapper";

interface ProductInterface{
    name:string;
    image:string;
    ['product-category']:string;
    slug:string;
    id:number;
}

interface CategoryPropsInterface{
    title:string;
    data:{
        current_page:number;
        data:ProductInterface[];
        last_page:number;
    }
}

export default function CategoryProducts({title, data}:CategoryPropsInterface) {
    return (
        <section className="products_systems">
            <div className="container">
                <div className="col-lg-10 mx-auto">
                    {title && (
                        <h3>{title}</h3>
                    )}

                    <div className="product_grid">
                        {data?.data?.map((item)=>(
                            <div key={item.id} className="product_item">
                                <figure>
                                    <Image src={item.image ?? '/assets/images/placeholders/product.webp'} alt={item.name} className="img-fluid" width={275} height={265} loading="lazy" />
                                </figure>
                                {item?.name && (
                                    <p>{item.name}</p>
                                )}
                            </div>
                        ))}
                        
                    </div>

                    <PaginationWrapper
                        currentPage={data?.current_page || 1}
                        totalPages={data?.last_page || 1}
                    />

                </div>

            </div>



        </section>
    )
}