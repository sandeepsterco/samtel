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
      // style={{ top: topOffset }}
      onMouseEnter={show ? onMouseEnter : undefined}
  onMouseLeave={show ? onMouseLeave : undefined}
    >
      <div className="menu-container">
          <div className="mega-wrapper">
            <div className="mega-left">
              <div>
                {getValue('title') && (
                  <blockquote dangerouslySetInnerHTML={{__html:getValue('title')?.value}} />
                )}
                
                <Link href="#" className="mega-btn">
                  <Image src={`/assets/icons/right-arrow-white.svg`} width={10} height={10} alt="arrow right" />
                </Link>
              </div>
              <div className="mega-count">
                {/* <span className="before"></span>
                <span className="after"></span> */}
                {getValue('count') && (
                  <b className="total" dangerouslySetInnerHTML={{__html:getValue('count')?.value}} />
                )}
                {getValue('para') && (
                  <p className="para">{getValue('para')?.value}</p>
                )}
              </div>
            </div>
            <div className="mega-grid">
              {categoryData.map((category, idx) => {
                if(category.featured){
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
  );
}