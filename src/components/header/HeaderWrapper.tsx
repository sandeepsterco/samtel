"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { HeaderContextProvider, useHeader } from "./HeaderContext";
import { createPortal } from "react-dom";

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
            {showMegaMenu && (
                createPortal(<div className="menu_backdrop"></div>, document.body)
            )}
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