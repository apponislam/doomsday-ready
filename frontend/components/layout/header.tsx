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
        <header className="page-header">
            <div>
                <span>{category}</span>
                <h1>{title}</h1>
            </div>
            <div className="header-chip">
                <StatusDot /> SYSTEM ONLINE
            </div>
        </header>
    );
}
