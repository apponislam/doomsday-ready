import React from "react";
import Link from "next/link";

interface BrandProps {
    onClick?: () => void;
}

export function Brand({ onClick }: BrandProps) {
    return (
        <Link href="/" className="flex items-center gap-3 border-0 bg-transparent text-left px-1.5 cursor-pointer max-lg:justify-center max-lg:px-0" onClick={onClick} aria-label="Doomsday Ready home">
            <span className="w-10 h-10 grid place-items-center border border-[#da3c35] text-white font-bold skew-x-[7deg] bg-linear-to-br from-[#8f1e1b] to-[#32100f] font-condensed text-base tracking-[-0.5px] shrink-0">DR</span>
            <span className="max-lg:hidden block">
                <strong className="block font-condensed text-[18px] text-white tracking-[2px] leading-none">DOOMSDAY</strong>
                <small className="block font-condensed text-brand-red text-[12px] mt-1.5 tracking-[4.5px] leading-none">READY</small>
            </span>
        </Link>
    );
}
