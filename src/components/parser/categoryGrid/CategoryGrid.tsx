import { BASE_URL } from "@/config/config";
import { apiFetch } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default async function CategoryGrid() {
  const { data, error } = await apiFetch(`product-categories`);

  if (error || !data) return;

  const CategoryData = data?.data;

  return (
    <section className="proso_portarea">
      <div className="container-group">
        <div className="proso_ttl">
          <h3 className="font45">Portfolio Areas</h3>
        </div>
        <div className="proso_porgid">
          {CategoryData?.map((category: any, id: number) => (
            <div className="prosolu_col" key={id}>
              <figure>
                <Image
                  src={category.product_image || '/assets/images/placeholders/placeholder1.webp'}
                  alt={category.name}
                  className="img-fluid w-100"
                  width={475}
                  height={330}
                  loading="lazy"
                />
              </figure>
              <h4 className="font24">{category.name}</h4>
              <Link href={`${BASE_URL}category/${category.slug}`} className="streched_link"></Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
