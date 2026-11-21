import React from "react";
import { Movie } from "@/types";
import { Icon } from "@/components/icons/icon";
import { CompletionOrb } from "@/components/plan/completion-orb";

interface PlanHeroProps {
    targetId: number;
    onTargetChange: (id: number) => void;
    movies: Movie[];
    percent: number;
}

export function PlanHero({ targetId, onTargetChange, movies, percent }: PlanHeroProps) {
    return (
        <div className="min-h-57.5 max-md:min-h-65 flex max-sm:block items-center justify-between overflow-hidden relative border border-[#342526] p-[30px_clamp(25px,5vw,60px)] max-md:p-6 bg-[radial-gradient(circle_at_82%_50%,rgba(222,51,45,0.2),transparent_22%),linear-gradient(110deg,#181316,#111316_70%)] after:content-[''] after:absolute after:inset-0 after:opacity-15 after:pointer-events-none after:bg-[repeating-linear-gradient(115deg,transparent_0_34px,#912723_35px,transparent_36px)] after:mask-[linear-gradient(90deg,transparent,black)]">
            <div className="relative z-2">
                <span className="flex items-center gap-1.5 text-brand-red font-semibold text-[10px] tracking-[2px] uppercase">
                    <Icon name="spark" size={15} /> TARGET MOVIE
                </span>
                <label className="flex items-center my-3 mb-2.5">
                    <select
                        className="appearance-none max-w-150 max-md:max-w-[calc(100vw-120px)] pr-9 border-0 bg-transparent outline-none text-white font-condensed font-semibold text-[clamp(30px,4vw,52px)] max-md:text-[33px] cursor-pointer"
                        value={targetId}
                        onChange={(e) => onTargetChange(Number(e.target.value))}
                    >
                        {movies.map((m) => (
                            <option key={m.id} value={m.id} className="bg-panel text-white text-[16px]">
                                {m.title}
                            </option>
                        ))}
                    </select>
                    <span className="text-brand-red -rotate-90 -ml-6 pointer-events-none">
                        <Icon name="chevron" />
                    </span>
                </label>
                <p className="text-[#8b8e93] text-[11px] m-0 max-sm:max-w-55">Your optimized watch order is ready. Every story, in the right sequence.</p>
            </div>

            <CompletionOrb percentage={percent} />
        </div>
    );
}
