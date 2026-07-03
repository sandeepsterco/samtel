import Breadcrumbs from "@/components/common/breadcrumbs/Breadcrumbs";
import InnerSection from "@/components/common/innerSection/InnerSection";

import '@/styles/inner.css'

export default function DynamicPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <InnerSection />
            <Breadcrumbs />
            {children}
        </>
    )
}