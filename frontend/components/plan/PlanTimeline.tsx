import React from "react";
import { Movie } from "@/types";
import { PlanTimelineRow } from "@/components/plan/plan-timeline-row";

interface PlanTimelineProps {
    order: Movie[];
    onToggleWatched: (id: number) => void;
}

export function PlanTimeline({ order, onToggleWatched }: PlanTimelineProps) {
    return (
        <section className="mt-11.25">
            <div className="flex justify-between items-end mb-7">
                <div>
                    <p className="text-brand-red text-[9px] font-semibold tracking-[2px] mb-2 uppercase">THE SEQUENCE</p>
                    <h2 className="font-condensed font-semibold text-[28px] text-white tracking-[-0.4px] m-0">{order.length ? `${order.length} films stand between you and Doomsday` : "No prerequisites required"}</h2>
                </div>
                <span className="text-[#5e6267] text-[7px] tracking-[1.4px] font-semibold uppercase hidden md:inline">ORDERED BY STORY DEPENDENCY</span>
            </div>

            <div className="flex flex-col">
                {order.map((movie, index) => (
                    <PlanTimelineRow key={movie.id} movie={movie} index={index} onToggleWatched={onToggleWatched} />
                ))}
            </div>
        </section>
    );
}

export default PlanTimeline;
