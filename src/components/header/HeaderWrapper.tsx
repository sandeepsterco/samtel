"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function HeaderWrapper({children}:{children:React.ReactNode}){
    const [baseClass, setBaseClass] = useState('');
    const pathname = usePathname();

    useEffect(()=>{
        if(pathname !== '/'){
            setBaseClass('inner')
        }else{
            setBaseClass('')
        }
    }, [pathname])

    return(
        <section className={`header ${baseClass}`}>
        {children}
        </section>
    )
}