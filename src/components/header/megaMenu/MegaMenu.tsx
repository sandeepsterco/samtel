import React from "react";
import { ProductCategory } from "../Header";
import Image from "next/image";
import Link from "next/link";
import "./megaMenu.css";

interface MegaMenuProps {
  show: boolean;
  categoryData: ProductCategory[];
  topOffset: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function MegaMenu({
  show,
  categoryData,
  topOffset,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  return (
    <div
      className={`mega-menu ${show ? "show" : ""}`}
      style={{ top: topOffset }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container">
        <div className="mega-wrapper">
          <div className="mega-left">
            <h2>
              Transforming the Future
              <span> of Avionics </span>
              through Indigenization and Innovation
            </h2>
            <Link href="#" className="mega-btn">
              →
            </Link>
            <div className="mega-count">
              <h3>20+</h3>
              <p>Patents and Defence Systems procured by the company</p>
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
  );
}