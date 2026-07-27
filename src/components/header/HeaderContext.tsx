"use client"
import { createContext, useContext, useState } from "react"

interface HeaderContextValue {
    showMegaMenu:boolean;
    setShowMegaMenu:(v:boolean)=>void;
}

const HeaderContext = createContext<HeaderContextValue | null>(null);

export function HeaderContextProvider({children}:{children:React.ReactNode}){
    const [showMegaMenu, setShowMegaMenu] = useState(false);

    return(
        <HeaderContext.Provider value={{ showMegaMenu, setShowMegaMenu }}>
            {children}
        </HeaderContext.Provider>
    )
}

export function useHeader(){
    const ctx = useContext(HeaderContext);
    if (!ctx) throw new Error("useHeader must be used inside HeaderContextProvider");

    return ctx;
}