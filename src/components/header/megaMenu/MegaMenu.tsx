import React from "react";
import { ProductCategory } from "../Header";
import Image from "next/image";
import Link from "next/link";
// import "./megaMenu.css";
import type { InfoItem } from "@/lib/info";
import { BASE_URL } from "@/config/config";

interface MegaMenuProps {
  show: boolean;
  categoryData: ProductCategory[];
  topOffset: number;
  infoData: InfoItem[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export default function MegaMenu({
  show,
  categoryData,
  topOffset,
  infoData,
  onMouseEnter,
  onMouseLeave,
  onClose 
}: MegaMenuProps) {

  const getValue = (key: string) => {
    return infoData.find((item) => item.key === key) ?? null;
  }


  return (
    <div
      className={`mega-menu ${show ? "show" : ""}`}
      // style={{ top: topOffset }}
      onMouseEnter={show ? onMouseEnter : undefined}
  onMouseLeave={show ? onMouseLeave : undefined}
    >
      <div className="container-full">
        <div className="product-mega-wrapper">
          <div className="mega-wrapper">
            <div className="mega-left">
              <div>
                {getValue('title') && (
                  <blockquote dangerouslySetInnerHTML={{__html:getValue('title')?.value ?? ''}} />
                )}
                
                <Link href={`${BASE_URL}industries`} className="mega-btn">
                  <Image src={`/assets/icons/right-arrow-white.svg`} width={10} height={10} alt="arrow right" />
                </Link>
              </div>
              <div className="mega-count">
                {/* <span className="before"></span>
                <span className="after"></span> */}
                {getValue('count') && (
                  <b className="total" dangerouslySetInnerHTML={{__html:getValue('count')?.value ?? ''}} />
                )}
                {getValue('para') && (
                  <p className="para">{getValue('para')?.value ?? ''}</p>
                )}
              </div>
            </div>
            <div className="mega-grid">
              {categoryData.map((category, idx) => {
                if(category.featured || category.slug.includes('industrial')){
                  return <Link
                  href={`/category/${category.slug}`}
                  key={idx}
                  className="industry-card"
                  onClick={onClose}
                >
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={637}
                      height={399}
                    />
                  )}
                  <span>{category.name}</span>
                </Link>
                }
              })}
            </div>
          </div>
          </div>
      </div>
    </div>
  );
}