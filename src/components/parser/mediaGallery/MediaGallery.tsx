"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import './mediaGallery.css'

export default function MediaGallery({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageData = data?.["media-press"] || [];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    Fancybox.bind(container, "[data-fancybox='gallery']", {
      Hash: false,
      Thumbs: {
        type: "classic",
      },
      Carousel: {
        infinite: true,
      },
      // No Toolbar option: defaults give counter left,
      // zoom / slideshow / fullscreen / thumbs / close on the right
    });

    return () => {
      Fancybox.unbind(container);
      Fancybox.close();
    };
  }, [pageData.length]);

  if (pageData.length === 0) return null;

  return (
    <div className="pres_list" ref={containerRef}>
      {pageData.map((item: any, idx: number) => (
        <div key={idx} className="media_bx">
          <figure>
            <Image
              src={item.image}
              alt={`Media Gallery ${item.name}`}
              className="img-fluid"
              width={343}
              height={373}
              loading="lazy"
            />
          </figure>

          <div className="zoombtn">
            <Image
              src="/assets/icons/zoombtn.svg"
              alt="zoom icon"
              className="img-fluid"
              width={39}
              height={39}
            />
          </div>

          <a
            data-fancybox="gallery"
            href={item.image}
            className="streched_link"
          ></a>
        </div>
      ))}
    </div>
  );
}