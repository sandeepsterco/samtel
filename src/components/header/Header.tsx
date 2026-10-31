import { apiFetch } from "@/lib/api";
import HeaderWrapper from "./HeaderWrapper";
import HeaderData from "./HeaderData";
import ReactParserDynamic from "@/components/common/reactParser/ReactParserDynamic";
import type { ReactNode } from "react";
import { normalizeInfoResponse } from "@/lib/info";
import "./header.css";

export interface HeaderMenuItem {
  title: string;
  slug: string;
  mega_menu?: {
    name: string;
    content: string;
  } | null;
}

export function isIndustriesMegaMenu(name?: string): boolean {
  return name?.trim().toLowerCase().replace(/[\s-]+/g, "_").startsWith("industr") ?? false;
}

interface HeaderResponse {
  header: HeaderMenuItem[];
}

interface ProductCategoryResponse {
  data: ProductCategory[];
}

export interface ProductCategory {
  name: string;
  slug: string;
  image?: string;
  featured: boolean;
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
  const [headerRes, sidebarRes, productCategoryRes, infoRes] = await Promise.all([
    apiFetch(`header`),
    apiFetch(`sidebar`),
    apiFetch(`product-categories`),
    apiFetch(`info`),
  ]);

  const headerData = (headerRes.data as HeaderResponse)?.header ?? [];
  const sidebarData = (sidebarRes.data as SidebarResponse)?.sidebar ?? [];
  const productCategoryData =
    (productCategoryRes.data as ProductCategoryResponse)?.data ?? [];
  const infoData = normalizeInfoResponse(infoRes?.data);
  const dropdownContents: (ReactNode | null)[] = headerData.map((item, index) =>
    item.mega_menu?.content && !isIndustriesMegaMenu(item.mega_menu.name) ? (
      <ReactParserDynamic
        key={`${item.mega_menu.name}-${index}`}
        html={item.mega_menu.content}
      />
    ) : null
  );

  return (
    <HeaderWrapper>
      <HeaderData
        headerData={headerData}
        dropdownContents={dropdownContents}
        sidebarData={sidebarData}
        productCategoryData={productCategoryData}
        infoData={infoData}
      />
    </HeaderWrapper>
  );
}
