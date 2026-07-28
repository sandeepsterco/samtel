import React from "react";
import { ProductCategory } from "../Header";
import Image from "next/image";
import Link from "next/link";
import "./megaMenu.css";

interface MegaMenuProps {
  show: boolean;
  categoryData: ProductCategory[];
  topOffset: number;
  infoData: any;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function MegaMenu({
  show,
  categoryData,
  topOffset,
  infoData,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {

  const getValue = (key: string) => {
    const found = infoData?.data.find((item: any) => item.key == key) ?? null;
    if (found?.value || found?.image || found?.url) {
      return {
        value: found?.value ?? null,
        image: found?.image ?? null,
        url: found?.url ?? null,
      }
    } else {
      return null;
    }
  }


  return (
    <div
      className={`mega-menu ${show ? "show" : ""}`}
      style={{ top: topOffset }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container-fluid">
        <div className="col-md-9 mx-auto">
          <div className="mega-wrapper">
            <div className="mega-left">
              <div>
                {getValue('title') && (
                  <h2 dangerouslySetInnerHTML={{__html:getValue('title')?.value}} />
                )}
                
                <Link href="#" className="mega-btn">
                  <Image src={`/assets/icons/right-arrow-white.svg`} width={16} height={16} alt="arrow right" />
                </Link>
              </div>
              <div className="mega-count">
                <span className="before"></span>
                <span className="after"></span>
                {getValue('count') && (
                  <h3 className="total" dangerouslySetInnerHTML={{__html:getValue('count')?.value}} />
                )}
                {getValue('para') && (
                  <p className="para">{getValue('para')?.value}</p>
                )}
              </div>
            </div>
            <div className="mega-grid">
              {categoryData.map((category, idx) => (
                <Link
                  href={`/category/${category.slug}`}
                  key={idx}
                  className="industry-card"
                  onClick={onMouseLeave}
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}