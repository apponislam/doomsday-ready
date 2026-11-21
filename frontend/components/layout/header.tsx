"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { StatusDot } from "@/components/ui/status-dot";

export function Header() {
    const pathname = usePathname();

    let category = "MOVIE ARCHIVE";
    let title = "Build your path to Doomsday";

    if (pathname.startsWith("/plan")) {
        category = "REWATCH PLAN";
        title = "Your mission briefing";
    } else if (pathname.startsWith("/booking")) {
        category = "OPENING NIGHT";
        title = "Reserve the squad";
    }

    return (
        <header className="h-23.5 max-md:h-18.5 flex items-center justify-between border-b border-[#202226] px-7 sm:px-12 lg:px-19">
            <div>
                <span className="text-brand-red text-[9px] font-semibold tracking-[2.2px] block uppercase">{category}</span>
                <h1 className="mt-1.5 font-condensed font-semibold text-[clamp(18px,2vw,23px)] tracking-[0.4px] text-white">{title}</h1>
            </div>
            <div className="hidden sm:flex items-center text-[#777b81] text-[8px] tracking-[1.3px] font-semibold">
                <StatusDot /> SYSTEM ONLINE
            </div>
        </header>
    );
}
