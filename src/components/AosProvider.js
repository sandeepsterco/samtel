"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";

export default function AosProvider() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    AOS.init({
      easing: "ease-out",
      disable: "mobile",
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) return;

    previousPathname.current = pathname;
    AOS.refreshHard();
  }, [pathname]);

  return null;
}