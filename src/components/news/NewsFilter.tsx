"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function NewsFilter() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const updateParams = (key:string, value:string)=>{
        const params = new URLSearchParams(searchParams.toString());
        if(value){
            params.set(key, value);
        }else{
            params.delete(key)
        }
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="filter_grid">
            <h3>News & Events</h3>

            <div className="filter_group">
                <div className="filter_month">
                    <select value={searchParams.get('month') ?? ''} onChange={(e)=>updateParams('month', e.target.value)}>
                        <option value="">Select Month</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>
                <div className="filter_year">
                    <select value={searchParams.get('year') ?? ''} onChange={(e)=>updateParams('year', e.target.value)}>
                        <option value="">Select Year</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>

                </div>
            </div>

        </div>
    )
}