"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconName } from "@/types";
import { Icon } from "@/components/icons/icon";
import { Brand } from "@/components/layout/brand";
import { PremiereCountdown } from "@/components/layout/premiere-countdown";

const links: { href: string; label: string; icon: IconName }[] = [
    { href: "/", label: "Movies", icon: "film" },
    { href: "/plan", label: "Rewatch Plan", icon: "route" },
    { href: "/booking", label: "Booking", icon: "ticket" },
];

export function Sidebar() {
    const pathname = usePathname();

    const isLinkActive = (href: string) => {
        if (href === "/") {
            return pathname === "/" || pathname === "/movies";
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-20 hidden md:flex flex-col w-61 max-lg:w-19.5 p-[30px_22px_20px] max-lg:px-4 bg-[#0e0f11] border-r border-[#25272b]">
            <Brand />

            <nav className="mt-13">
                <p className="max-lg:hidden text-[#73777d] font-semibold text-[10px] tracking-[2px] px-3 pb-2.5 uppercase font-sans">COMMAND CENTER</p>
                {links.map((link) => {
                    const active = isLinkActive(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative w-full flex items-center gap-3 px-3 py-3.5 my-1 rounded-[3px] text-[13px] text-left transition-colors duration-150 max-lg:justify-center ${
                                active
                                    ? "text-white bg-linear-to-r from-[#331817] to-[#181718] before:content-[''] before:absolute before:-left-5.5 max-lg:before:-left-4 before:top-1.75 before:bottom-1.75 before:w-0.5 before:bg-brand-red before:shadow-[0_0_12px_#ef3e36]"
                                    : "text-[#8d9197] hover:text-[#ddd] hover:bg-[#15171a]"
                            }`}
                        >
                            <span className={active ? "text-brand-red" : ""}>
                                <Icon name={link.icon} />
                            </span>
                            <span className="max-lg:hidden">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <PremiereCountdown />
        </aside>
    );
}
