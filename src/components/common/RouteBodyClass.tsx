"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteBodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    const routeClass = pathname === "/"
      ? "homepage"
      : pathname
        .split("/")
        .filter(Boolean)
        .join("-")
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    if (!routeClass) return;

    document.body.classList.add(routeClass);
    return () => document.body.classList.remove(routeClass);
  }, [pathname]);

  return null;
}