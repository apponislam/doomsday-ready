"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons/icon";

const navItems: { href: string; label: string; icon: "film" | "route" | "ticket" }[] = [
    { href: "/", label: "Movies", icon: "film" },
    { href: "/plan", label: "Plan", icon: "route" },
    { href: "/booking", label: "Booking", icon: "ticket" },
];

export function MobileNav() {
    const pathname = usePathname();

    const isLinkActive = (href: string) => {
        if (href === "/") {
            return pathname === "/" || pathname === "/movies";
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="mobile-nav">
            {navItems.map((item) => {
                const active = isLinkActive(item.href);
                return (
                    <Link key={item.href} href={item.href} className={active ? "active" : ""}>
                        <Icon name={item.icon} />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
