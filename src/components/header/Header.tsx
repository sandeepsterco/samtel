import { apiFetch } from "@/lib/api";
import HeaderWrapper from "./HeaderWrapper";
import HeaderData from "./HeaderData";
import "./header.css";

export interface HeaderMenuItem {
  title: string;
  slug: string;
}

interface HeaderResponse {
  header: HeaderMenuItem[];
}

export interface ProductCategory {
  name: string;
  slug: string;
  image?: string;
}

interface ProductCategoryResponse {
  data: ProductCategory[];
}

export interface SidebarItem {
  title: string;
  slug: string;
  children: SidebarItem[];
}

interface SidebarResponse {
  sidebar: SidebarItem[];
}

export default async function Header() {
  const [headerRes, sidebarRes, productCategoryRes] = await Promise.all([
    apiFetch(`header`),
    apiFetch(`sidebar`),
    apiFetch(`product-categories`),
  ]);

  const headerData = (headerRes.data as HeaderResponse)?.header ?? [];
  const sidebarData = (sidebarRes.data as SidebarResponse)?.sidebar ?? [];
  const productCategoryData =
    (productCategoryRes.data as ProductCategoryResponse)?.data ?? [];

  return (
    <HeaderWrapper>
      <HeaderData
        headerData={headerData}
        sidebarData={sidebarData}
        productCategoryData={productCategoryData}
      />
    </HeaderWrapper>
  );
}
