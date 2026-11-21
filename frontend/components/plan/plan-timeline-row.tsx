import React from "react";
import { Movie } from "@/types";
import { Icon } from "@/components/icons/icon";

interface PlanTimelineRowProps {
    movie: Movie;
    index: number;
    onToggleWatched: (id: number) => void;
}

export function PlanTimelineRow({ movie, index, onToggleWatched }: PlanTimelineRowProps) {
    return (
        <div className="grid grid-cols-[45px_1fr] min-h-22.75">
            <div className="relative flex justify-center after:content-[''] after:absolute after:top-9.25 after:bottom-0 after:w-px after:bg-[#34373b] last:after:hidden">
                <span
                    className={`z-2 w-7.25 h-7.25 grid place-items-center rounded-full border text-[10px] font-condensed font-semibold ${
                        movie.watched
                            ? "border-[#7d312e] bg-brand-deep text-brand-red"
                            : "border-[#3a3d42] bg-[#131518] text-[#74787e]"
                    }`}
                >
                    {movie.watched ? <Icon name="check" size={15} /> : index + 1}
                </span>
            </div>

            <div className="h-18.75 flex items-center justify-between px-5 max-md:px-3 border border-[#282b2f] bg-[#121417] hover:border-[#42454a] hover:bg-[#16181b] transition-all duration-150">
                <div>
                    <span className="block text-brand-red text-[7px] tracking-[1.4px] font-semibold">FILM {String(index + 1).padStart(2, "0")}</span>
                    <h3 className="inline-block my-0.5 mr-3.5 font-condensed font-semibold text-[17px] text-white">{movie.title}</h3>
                    <p className="inline-flex items-center gap-1.5 m-0 text-[#65696e] text-[8px] font-medium">
                        {movie.year} <i className="w-0.5 h-0.5 rounded-full bg-[#5f6368] not-italic block" /> {movie.runtime} MIN
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => onToggleWatched(movie.id)}
                    aria-label={`Mark ${movie.title} ${movie.watched ? "unwatched" : "watched"}`}
                    className="flex items-center gap-3 border-0 bg-transparent cursor-pointer group"
                >
                    <span className="text-[#6d7177] group-hover:text-white text-[9px] tracking-[1.1px] font-semibold whitespace-nowrap transition-colors max-md:hidden">
                        {movie.watched ? "WATCHED" : "MARK AS WATCHED"}
                    </span>
                    <span
                        className={`w-4.5 h-4.5 grid place-items-center border border-[#43464c] bg-transparent text-white shrink-0 transition-colors ${
                            movie.watched ? "bg-brand-dark border-brand-red" : "group-hover:border-[#777]"
                        }`}
                    >
                        {movie.watched && <Icon name="check" size={13} />}
                    </span>
                </button>
            </div>
        </div>
    );
}
