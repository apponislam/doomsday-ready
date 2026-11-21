import React from "react";

interface CompletionOrbProps {
    percentage: number;
}

export function CompletionOrb({ percentage }: CompletionOrbProps) {
    return (
        <div
            className="relative z-2 w-32.5 h-32.5 max-md:w-21.25 max-md:h-21.25 shrink-0 grid place-items-center rounded-full shadow-[0_0_55px_rgba(198,43,37,0.18)] max-sm:absolute max-sm:right-5 max-sm:bottom-5 before:content-[''] before:absolute before:inset-1.5 before:rounded-full before:bg-[#141316]"
            style={{
                background: `conic-gradient(#ef3e36 0 ${percentage}%, #2a2022 ${percentage}%)`,
            }}
        >
            <div className="relative text-center">
                <strong className="block font-condensed font-semibold text-[34px] max-md:text-[24px] text-white leading-none">{percentage}%</strong>
                <span className="block text-[#767a80] text-[7px] tracking-[1.5px] mt-1 font-semibold">COMPLETE</span>
            </div>
        </div>
    );
}
