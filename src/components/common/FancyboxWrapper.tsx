"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

type Variant = "gallery" | "video";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CONFIGS: Record<Variant, { selector: string; options: Record<string, any> }> = {
  gallery: {
    selector: "[data-fancybox='gallery']",
    options: {
      Hash: false,
      Thumbs: { type: "classic" },
      Carousel: { infinite: true },
    },
  },
  video: {
    selector: "[data-fancybox='video']",
    options: {
      type: "iframe",
      iframe: { preload: false },
    },
  },
};

export default function FancyboxWrapper({
  children,
  className,
  variant = "gallery",
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { selector, options } = CONFIGS[variant];
    Fancybox.bind(container, selector, options);

    return () => {
      Fancybox.unbind(container);
      Fancybox.close();
    };
  }, [variant]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}