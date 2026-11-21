import React, { CSSProperties } from "react";
import { Movie } from "@/types";

interface PlanStatsGridProps {
    order: Movie[];
    watchedCount: number;
    remainingMinutes: number;
    percent: number;
}

export function PlanStatsGrid({ order, watchedCount, remainingMinutes, percent }: PlanStatsGridProps) {
    const nextMovie = order.find((m) => !m.watched);
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    const movieNights = Math.ceil(remainingMinutes / 120);

    return (
        <div className="grid grid-cols-3 max-md:grid-cols-2 border border-line border-t-0">
            <div className="min-h-28 p-[23px_27px] max-md:p-4.5 border-r border-line">
                <span className="text-[#686c71] text-[8px] tracking-[1.4px] font-semibold block">PROGRESS</span>
                <strong className="block mt-2 font-condensed font-semibold text-[25px] text-white">
                    {watchedCount}
                    <small className="text-[#878b90] text-[12px] font-normal"> / {order.length} watched</small>
                </strong>
                <div className="h-0.75 bg-[#2b2d31] mt-3 overflow-hidden rounded-full">
                    <i className="block h-full bg-brand-red shadow-[0_0_8px_#ef3e36] transition-all duration-300 not-italic" style={{ width: `${percent}%` } as CSSProperties} />
                </div>
            </div>

            <div className="min-h-28 p-[23px_27px] max-md:p-4.5 border-r border-line max-md:border-r-0">
                <span className="text-[#686c71] text-[8px] tracking-[1.4px] font-semibold block">TIME REMAINING</span>
                <strong className="block mt-2 font-condensed font-semibold text-[25px] text-white">
                    {hours}h <small className="text-[#878b90] text-[12px] font-normal">{minutes}m</small>
                </strong>
                <p className="text-[#686c72] mt-1.5 text-[8px]">Approximately {movieNights} movie nights</p>
            </div>

            <div className="min-h-28 p-[23px_27px] max-md:p-4.5 max-md:col-span-2 max-md:border-t max-md:border-line">
                <span className="text-[#686c71] text-[8px] tracking-[1.4px] font-semibold block">NEXT UP</span>
                <strong className="block mt-2 font-condensed font-semibold text-[25px] max-md:text-[17px] text-white truncate">{nextMovie ? nextMovie.title : "All caught up"}</strong>
                <p className="text-[#686c72] mt-1.5 text-[8px]">{nextMovie ? nextMovie.runtime : 0} minutes</p>
            </div>
        </div>
    );
}
