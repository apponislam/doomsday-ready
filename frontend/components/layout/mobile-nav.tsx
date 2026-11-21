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
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-60 grid grid-cols-3 h-[calc(62px+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-[#0e0f11]/95 border-t border-[#282a2f] backdrop-blur-md">
            {navItems.map((item) => {
                const active = isLinkActive(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center justify-center gap-1.5 h-full border-0 bg-transparent text-[10px] font-semibold uppercase tracking-[0.6px] no-underline cursor-pointer whitespace-nowrap px-1 transition-colors ${
                            active ? "text-brand-red" : "text-[#71757d] hover:text-[#d1d5db]"
                        }`}
                    >
                        <span className="w-5 h-5 flex items-center justify-center shrink-0">
                            <Icon name={item.icon} />
                        </span>
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
