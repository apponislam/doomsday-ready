import React from "react";

interface BundleGridProps {
    counts: Record<number, number>;
}

export function BundleGrid({ counts }: BundleGridProps) {
    const sorted = Object.entries(counts).sort((a, b) => Number(b[0]) - Number(a[0]));

    return (
        <div className="flex gap-2.5 my-6 flex-wrap sm:flex-nowrap">
            {sorted.map(([size, count]) => (
                <div key={size} className="relative flex-1 min-w-22.5 min-h-26.25 grid place-content-center text-center border border-[#303338] bg-[#15171a] p-3">
                    <span className="absolute right-2 top-2 text-brand-red font-condensed font-semibold text-[10px]">{count}×</span>
                    <strong className="font-condensed font-semibold text-[35px] text-white leading-none">{size}</strong>
                    <small className="text-[#65696f] text-[7px] tracking-[1.1px] font-semibold mt-1">SEAT BUNDLE</small>
                </div>
            ))}
        </div>
    );
}
