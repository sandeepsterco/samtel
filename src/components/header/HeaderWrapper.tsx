"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { HeaderContextProvider, useHeader } from "./HeaderContext";

function HeaderShell({ children }: { children: React.ReactNode }) {
    const [baseClass, setBaseClass] = useState("");
    const pathname = usePathname();
    const { showMegaMenu } = useHeader();

    useEffect(() => {
        setBaseClass(pathname !== "/" ? "inner" : "");
    }, [pathname]);

    return (
        <section className={`header ${baseClass} ${showMegaMenu ? "menu-open" : ""}`}>
            {children}
        </section>
    );
}

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <HeaderContextProvider>
            <HeaderShell>{children}</HeaderShell>
        </HeaderContextProvider>
    );
}