import React, { CSSProperties } from "react";
import { Movie } from "@/types";
import { Icon } from "@/components/icons/icon";

interface MovieRowProps {
    movie: Movie;
    index: number;
    allMovies: Movie[];
    onToggleWatched: (id: number) => void;
    onEdit: (id: number) => void;
}

export function MovieRow({ movie, index, allMovies, onToggleWatched, onEdit }: MovieRowProps) {
    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;

    return (
        <div
            className={`grid items-center px-5 max-md:px-2.5 min-h-18.5 max-md:min-h-26 border-b border-[#24262a] last:border-b-0 hover:bg-panel-soft transition-colors duration-150 max-md:grid-cols-[30px_1fr_32px] max-md:[grid-template-areas:'check_title_edit'_'check_meta_edit'_'pre_pre_pre'] max-md:p-3.5 max-md:mb-2 max-md:border max-md:border-[#282b30] max-md:bg-[#121417] grid-cols-[62px_minmax(240px,1.5fr)_100px_110px_minmax(180px,1fr)_42px] max-lg:grid-cols-[50px_minmax(210px,1.5fr)_80px_90px_1fr_36px]`}
            style={{ "--delay": `${index * 35}ms` } as CSSProperties}
        >
            <button
                className={`w-4.5 h-4.5 grid place-items-center p-0 border border-[#41444a] bg-transparent text-white cursor-pointer shrink-0 transition-colors max-md:[grid-area:check] ${
                    movie.watched ? "border-brand-red bg-brand-dark" : ""
                }`}
                aria-label={`Mark ${movie.title} ${movie.watched ? "unwatched" : "watched"}`}
                onClick={() => onToggleWatched(movie.id)}
            >
                {movie.watched && <Icon name="check" size={14} />}
            </button>

            <div className="flex items-center gap-3.5 max-md:[grid-area:title]">
                <span className="text-[#44474c] font-condensed font-medium text-[12px]">{String(index + 1).padStart(2, "0")}</span>
                <div>
                    <strong className="block font-condensed font-semibold text-[15px] tracking-[0.2px] text-white">{movie.title}</strong>
                    <small className={`block mt-1 text-[7px] tracking-[1.2px] font-semibold ${movie.watched ? "text-[#7c873e]" : "text-[#5f6368]"}`}>
                        {movie.watched ? "MISSION COMPLETE" : "AWAITING WATCH"}
                    </small>
                </div>
            </div>

            <span className="text-[#a4a7ac] font-condensed font-medium text-[11px] tracking-[0.5px] max-md:[grid-area:meta]">{movie.year}</span>
            <span className="text-[#a4a7ac] font-condensed font-medium text-[11px] tracking-[0.5px] max-md:hidden">
                {hours}H {minutes}M
            </span>

            <div className="flex gap-1.5 flex-wrap max-md:[grid-area:pre] max-md:pt-2.5">
                {movie.prerequisites.length ? (
                    movie.prerequisites.map((id) => (
                        <span key={id} className="px-1.5 py-1 text-[#a4a7ad] bg-[#202227] border border-[#303238] text-[8px] font-medium">
                            {allMovies.find((m) => m.id === id)?.title.replace("Captain America: ", "") ?? `ID ${id}`}
                        </span>
                    ))
                ) : (
                    <em className="text-[#55595f] text-[10px] not-italic">None</em>
                )}
            </div>

            <button
                className="w-7.5 h-7.5 grid place-items-center border-0 bg-transparent text-[#5d6167] cursor-pointer hover:text-white hover:bg-line transition-colors max-md:[grid-area:edit]"
                onClick={() => onEdit(movie.id)}
                aria-label={`Edit ${movie.title}`}
            >
                <Icon name="edit" size={16} />
            </button>
        </div>
    );
}
